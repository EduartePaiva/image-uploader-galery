"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, eq } from "drizzle-orm"

// AWS IMPORTS
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { z } from "zod"

const s3 = new S3Client({
    region: process.env.MY_AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
})

const zodSchema = z.string()

export async function deleteImageAction(unparsedImageId: string) {
    try {
        const imageId = zodSchema.parse(unparsedImageId)
        const { userId } = await auth()
        const client = await clerkClient()
        if (!userId) return { failure: "User not authenticated" }

        const userPromise = client.users.getUser(userId)
        const imageKey = await db
            .delete(images)
            .where(and(eq(images.userId, userId), eq(images.id, imageId)))
            .returning({
                imageKey: images.imageURL,
                imageId: images.id,
            })

        const command = new DeleteObjectCommand({
            Bucket: process.env.MY_AWS_PROCESSED_IMAGES_BUCKET_NAME,
            Key: imageKey[0].imageKey,
        })
        const delObjResponse = await s3.send(command)

        const user = await userPromise
        const { user_images_count, user_plan } = user.publicMetadata
        if (user_images_count !== undefined && user_plan !== undefined) {
            client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    user_plan,
                    user_images_count: user_images_count > 0 ? user_images_count - 1 : 0,
                },
            })
        } else {
            console.error(
                "This should never happen because if one image is uploaded then these variables are always not undefined",
            )
        }

        if (
            delObjResponse.$metadata.httpStatusCode &&
            delObjResponse.$metadata.httpStatusCode >= 200 &&
            delObjResponse.$metadata.httpStatusCode < 300
        ) {
            return { success: { message: "Image deleted", imageId: imageKey[0].imageId } }
        } else {
            return { failure: "Error deleting from s3" }
        }
    } catch {
        console.error("[DELETE_IMAGE_ACTION]: Error while deleting image")
        return { failure: "Failed to delete image" }
    }
}
