'use server'

import { auth } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, eq } from "drizzle-orm"

export default async function confirmImageUploaded(draftPostId: string) {
    try {
        const { userId } = auth()
        if (!userId) {
            return { failure: "Not authenticated" }
        }

        const result = await db.select({
            draft: images.draft,
            imageURL: images.imageURL
        }).from(images).where(and(
            eq(images.userId, userId),
            eq(images.id, draftPostId)
        ))

        if (result.length == 0) {
            return { failure: "Invalid draftPostId" }
        }

        if (!result[0].draft) {
            return { failure: "draftPostId is not a draft anymore" }
        }

        // now activate lambda function.



    } catch {
        return { failure: "Failure while processing image." }
    }
}