"use server"

import { auth } from "@clerk/nextjs"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"
import crypto from "crypto"
import { clerkClient } from "@clerk/nextjs"
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const maxFileSize = 1024 * 1024 * 10 //10MB

export default async function getSignedURL(
    type: string,
    size: number,
    checksum: string,
    x1: string,
    y1: string,
    portraitWidth: string,
    portraitHight: string,
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return { failure: "Not authenticated" }
        }

        //validate the user plan
        const user = await clerkClient.users.getUser(userId)
        let { user_images_count, user_plan } = user.publicMetadata
        if (user_plan === undefined) user_plan = "free"
        if (user_images_count === undefined) user_images_count = 0
        if (user_plan === "free" && user_images_count >= 100) {
            return { failure: "User already have 100 images" }
        }

        if (!acceptedTypes.includes(type)) {
            return { failure: "Invalid file type" }
        }
        if (size > maxFileSize) {
            return { failure: "File too large" }
        }

        const imageName = generateFileName()

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            ContentType: type,
            ContentLength: size,
            ChecksumSHA256: checksum,
            Metadata: {
                x1,
                y1,
                portraitWidth,
                portraitHight,
            },
        })
        // the metadata will be used to associate data with s3 later
        const signedURLPromise = getSignedUrl(s3, putObjectCommand, {
            expiresIn: 60,
        })

        const postIdPromise = db
            .insert(images)
            .values({
                imageURL: imageName,
                userId,
            })
            .returning({ postId: images.id })
            .then((val) => val[0].postId)

        const [signedURL, postId] = await Promise.all([signedURLPromise, postIdPromise])

        if (!postId || postId === "") {
            return { failure: "Error creating post draft" }
        }

        //await clerk finish the starting job
        return { success: { url: signedURL, postId } }
    } catch (err) {
        return { failure: `${err}` }
    }
}
