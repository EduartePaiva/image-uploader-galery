"use server"

import { auth, clerkClient } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, eq } from "drizzle-orm"

// s3 stuff
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
    region: process.env.MY_AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
})

// lambda stuff
import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda" // ES Modules import
import { ImageData } from "@/types/types.t"
const lambdaClient = new LambdaClient({
    region: process.env.MY_AWS_LAMBDA_REGION,
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
})

export default async function confirmImageUploaded(draftPostId: string) {
    try {
        const { userId } = auth()
        //auth the user
        if (!userId) {
            return { failure: "Not authenticated" }
        }

        // get imageUrl
        const dbResultPromise = db
            .select({
                draft: images.draft,
                imageURL: images.imageURL,
            })
            .from(images)
            .where(and(eq(images.userId, userId), eq(images.id, draftPostId)))
        const userPromise = clerkClient.users.getUser(userId)

        // await both results
        const [user, dbResult] = await Promise.all([userPromise, dbResultPromise])

        let { user_images_count, user_plan } = user.publicMetadata
        if (user_plan === undefined) user_plan = "free"
        if (user_images_count === undefined) user_images_count = 0

        if (dbResult.length === 0) {
            return { failure: "Invalid draftPostId" }
        }

        if (!dbResult[0].draft) {
            return { failure: "draftPostId is not a draft anymore" }
        }

        // now activate lambda function.
        const input: InvokeCommandInput = {
            // InvocationRequest
            FunctionName: process.env.MY_AWS_LAMBDA_NAME, // required
            InvocationType: "RequestResponse",
            Payload: Buffer.from(JSON.stringify({ image_name: dbResult[0].imageURL })), // e.g. Buffer.from("") or new TextEncoder().encode("")
        }
        const command = new InvokeCommand(input)
        const response = await lambdaClient.send(command)
        if (response.StatusCode && response.StatusCode === 200 && response.Payload) {
            const body = Buffer.from(response.Payload).toString("utf8")
            const obj = JSON.parse(body)
            if (!obj.success) {
                return { failure: "Success is not true" }
            }
        } else {
            return { failure: "Error while processing the image" }
        }

        // get PresignedUrl from s3 now.
        const bucketName = process.env.MY_AWS_PROCESSED_IMAGES_BUCKET_NAME
        const imagePresignedUrl = getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: bucketName,
                Key: dbResult[0].imageURL,
            }),
            { expiresIn: 300 },
        )

        // update clerk image count
        const clerkUpdatePromise = clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                user_plan,
                user_images_count: user_images_count + 1,
            },
        })
        // update image status to true
        const image = await db
            .update(images)
            .set({
                draft: false,
            })
            .where(and(eq(images.userId, userId), eq(images.id, draftPostId)))
            .returning({
                imageId: images.id,
                createdAt: images.createdAt,
            })

        const imageReturn: ImageData = {
            createdAt: image[0].createdAt.getTime(),
            imageId: image[0].imageId,
            imageURL: await imagePresignedUrl,
        }

        // await clerk, it can be awaited last
        await clerkUpdatePromise
        return { success: { message: "success processing image", image: imageReturn } }
    } catch {
        console.error("Error while processing image.")
        return { failure: "Error while processing image." }
    }
}
