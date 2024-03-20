"use server"

import { auth } from "@clerk/nextjs"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import db from "@/db/drizzle"
import { images } from "@/db/schema/images"

import crypto from "crypto"
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")


// only set endpoint for local s3
const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    endpoint: "http://localhost:5000",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

const acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
]

const maxFileSize = 1024 * 1024 * 10 //10MB

export default async function getSignedURL(
    type: string,
    size: number,
    checksum: string,
    x1: string,
    y1: string,
    portraitWidth: string,
    portraitHight: string
) {
    try {
        const { userId } = auth()
        if (!userId) {
            return { failure: "Not authenticated" }
        }
        if (!acceptedTypes.includes(type)) {
            return { failure: "Invalid file type" }
        }
        if (size > maxFileSize) {
            return { failure: "File too large" }

        }

        const imageName = generateFileName()

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: imageName,
            ContentType: type,
            ContentLength: size,
            ChecksumSHA256: checksum,
            Metadata: {
                x1,
                y1,
                portraitWidth,
                portraitHight
            }
        })
        // the metadata will be used to associate data with s3 later

        const signedURL = await getSignedUrl(s3, putObjectCommand, {
            expiresIn: 60
        })

        const postId = await db.insert(images).values({
            imageURL: imageName,
            userId,
        }).returning({ postId: images.id }).then(val => val[0].postId)

        if (!postId || postId === "") {
            return { failure: "Error creating post draft" }
        }


        return { success: { url: signedURL, postId } }
    } catch (err) {
        return { failure: `${err}` }
    }
}