"use server"

import { auth } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, eq } from "drizzle-orm"


export async function deleteImageAction(imageId: string) {
    try {
        const { userId } = auth()
        if (!userId) return { failure: "User not authenticated" }


        const imageKey = await db.delete(images)
            .where(
                and(
                    eq(images.userId, userId),
                    eq(images.id, imageId + "sadsaddsa")
                )
            )
            .returning({
                imageKey: images.imageURL
            })
        console.log(imageKey)


    } catch {
        console.error("Error while deleting image")
        return { failure: "Failed to delete image" }
    }

}