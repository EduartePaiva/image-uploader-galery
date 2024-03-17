"use server"

import { auth } from "@clerk/nextjs"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import crypto from "crypto"
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")



const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
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

export default async function getSignedURL(type: string, size: number, checksum: string) {
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


    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: generateFileName(),
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checksum,
        Metadata: {
            userId
        }
    })
    // the metadata will be used to associate data with s3 later

    const signedURL = await getSignedUrl(s3, putObjectCommand, {
        expiresIn: 60
    })

    return { success: { url: signedURL } }
}