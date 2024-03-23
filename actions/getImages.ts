"use server"

import { auth } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, desc, eq } from "drizzle-orm"


export async function getImagesUrlAction() {
    try {
        const { userId } = auth()

        if (!userId) {
            return { failure: "User not authenticated" }
        }

        const imagesUrl = await db.select({
            imageURL: images.imageURL
        })
            .from(images)
            .where(
                and(
                    eq(images.userId, userId),
                    eq(images.draft, false)
                )
            ).orderBy(desc(images.createdAt))
        const bucketName = process.env.AWS_PROCESSED_IMAGES_BUCKET_NAME!

        const newImagesUrl = imagesUrl.map(imageURL => {
            const urlKey = imageURL.imageURL
            return `https://${bucketName}.s3.sa-east-1.amazonaws.com/${urlKey}`
        })

        return { success: newImagesUrl }

    } catch (err) {
        return { failure: "Something has throw" }
    }
}