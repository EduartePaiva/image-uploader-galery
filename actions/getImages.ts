"use server"

import { auth } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, asc, desc, eq, gt, lt } from "drizzle-orm"
import type { ImageData } from '@/types/types.t'

const PAGINATION_NUMBER = 10;


type getImageDataReturn = {
    failure: string;
    success?: undefined;
} | {
    success: ImageData[];
    failure?: undefined;
}


export async function getImagesDataAction(cursor?:number): Promise<getImageDataReturn> {
    try {
        const { userId } = auth()

        if (!userId) {
            return { failure: "User not authenticated" }
        }

        const imagesData = await db.select({
            imageURL: images.imageURL,
            imageId: images.id,
            createdAt: images.createdAt
        })
            .from(images)
            .where(
                and(
                    eq(images.userId, userId),
                    eq(images.draft, false),
                    cursor ? lt(images.createdAt, new Date(cursor)) : undefined
                )
            )
            .limit(PAGINATION_NUMBER)
            .orderBy(desc(images.createdAt))
        const bucketName = process.env.AWS_PROCESSED_IMAGES_BUCKET_NAME!

        // imagesData.map(imageData => ({
        //     const urlKey = imageData.imageURL
        //     const createdAt = imageData.createdAt.getTime()
        //     imageData.imageURL: `https://${bucketName}.s3.sa-east-1.amazonaws.com/${urlKey}`
        // }))

        return { success: imagesData.map(imageData => ({
            createdAt: imageData.createdAt.getTime(),
            imageId: imageData.imageId,
            imageURL: `https://${bucketName}.s3.sa-east-1.amazonaws.com/${imageData.imageURL}`
        })) }

    } catch (err) {
        console.log("Error while getting images")
        return { failure: "Something has throw" }
    }
}