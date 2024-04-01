"use server"

//auth
import { auth } from "@clerk/nextjs"
//database
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, eq } from "drizzle-orm"
//aws stuff
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})


type getImagePresignedReturn = Promise<{
    success?: undefined;
    failure: string;
} | {
    success: string;
    failure?: undefined
}>

export async function getImagePresignedUrlAction(imageId: string): getImagePresignedReturn {
    try {
        const { userId } = auth()
        if (!userId) return { failure: "Unauthenticated" }

        const imageURL = await db
            .select({ imageKey: images.imageURL })
            .from(images)
            .where(and(
                eq(images.id, imageId),
                eq(images.userId, userId)
            ))
        if (imageURL.length == 0) return { failure: "Db query with length 0 shouldn't happen" }
        const imageKey = imageURL[0].imageKey

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_PROCESSED_IMAGES_BUCKET_NAME!,
            Key: imageKey
        })
        const url = await getSignedUrl(s3, command, { expiresIn: 60 })

        return { success: url }
    } catch {
        return { failure: "Could not get image url" }
    }
}