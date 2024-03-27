'use server'

import { auth } from "@clerk/nextjs"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import { and, eq } from "drizzle-orm"

import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda"; // ES Modules import
import { revalidatePath } from "next/cache"
const client = new LambdaClient({
    region: process.env.AWS_LAMBDA_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});


export default async function confirmImageUploaded(draftPostId: string) {
    try {
        const { userId } = auth()
        //auth the user
        if (!userId) {
            return { failure: "Not authenticated" }
        }

        // get imageUrl
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

        const input: InvokeCommandInput = { // InvocationRequest
            FunctionName: process.env.AWS_LAMBDA_NAME!, // required
            InvocationType: "RequestResponse",
            Payload: Buffer.from(JSON.stringify({ image_name: result[0].imageURL }))// e.g. Buffer.from("") or new TextEncoder().encode("")
        };
        const command = new InvokeCommand(input);
        const response = await client.send(command);
        if (response.StatusCode && response.StatusCode === 200 && response.Payload) {
            const body = Buffer.from(response.Payload).toString('utf8')
            const obj = JSON.parse(body)
            if (!obj.success) {
                return { failure: "Success is not true" }
            }
        } else {
            return { failure: "Error while processing the image" }
        }

        // update image status to true

        await db.update(images).set({
            draft: false
        }).where(and(
            eq(images.userId, userId),
            eq(images.id, draftPostId)
        ))

        revalidatePath('/')

        return { success: '' }
    } catch {
        return { failure: "Error while processing image." }
    }
}