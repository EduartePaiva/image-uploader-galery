"use server"

import { auth } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, eq } from "drizzle-orm"
import { clerkClient } from "@clerk/nextjs";

// AWS IMPORTS
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

export async function deleteImageAction(imageId: string) {
    try {
        const { userId } = auth()
        if (!userId) return { failure: "User not authenticated" }


        const userPromise = clerkClient.users.getUser(userId)
        const imageKey = await db.delete(images)
            .where(
                and(
                    eq(images.userId, userId),
                    eq(images.id, imageId)
                )
            )
            .returning({
                imageKey: images.imageURL
            })

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_PROCESSED_IMAGES_BUCKET_NAME!,
            Key: imageKey[0].imageKey,
        })
        const delObjResponse = await s3.send(command)

        const user = await userPromise
        const {user_images_count, user_plan} = user.publicMetadata
        if (user_images_count !== undefined && user_plan !== undefined){
            clerkClient.users.updateUserMetadata(userId, {
                publicMetadata: {
                    user_plan,
                    user_images_count: user_images_count > 0 ? user_images_count-1 : 0
                }
            })
        }else{
            console.error("This should never happen because if one image is uploaded then these variables are always not undefined")
        }

        if (
            delObjResponse.$metadata.httpStatusCode &&
            delObjResponse.$metadata.httpStatusCode >= 200 &&
            delObjResponse.$metadata.httpStatusCode < 300) {
            return { success: "Image deleted" }
        } else {
            return { failure: "Error deleting from s3" }
        }
    } catch {
        console.error("[DELETE_IMAGE_ACTION]: Error while deleting image")
        return { failure: "Failed to delete image" }
    }
}