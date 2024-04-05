"use server"

import { auth } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, desc, eq } from "drizzle-orm"


export async function getImagesDataAction() {
    try {
        const { userId } = auth()

        if (!userId) {
            return { failure: "User not authenticated" }
        }

        const imagesData = await db.select({
            imageURL: images.imageURL,
            imageId: images.id
        })
            .from(images)
            .where(
                and(
                    eq(images.userId, userId),
                    eq(images.draft, false)
                )
            ).orderBy(desc(images.createdAt))
        const bucketName = process.env.AWS_PROCESSED_IMAGES_BUCKET_NAME!

        imagesData.forEach(imageData => {
            const urlKey = imageData.imageURL
            imageData.imageURL = `https://${bucketName}.s3.sa-east-1.amazonaws.com/${urlKey}`
        })

        return { success: imagesData }

    } catch (err) {
        console.log("Error while getting images")
        return { failure: "Something has throw" }
    }
}