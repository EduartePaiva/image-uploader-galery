"use server";

import db from "@/db";
import { images } from "@/db/schema";
import { env } from "@/env/server";
import type { ImageData } from "@/types/types.t";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";

//aws stuff
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: env.MY_AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: env.MY_AWS_ACCESS_KEY,
        secretAccessKey: env.MY_AWS_SECRET_ACCESS_KEY,
    },
});

const PAGINATION_NUMBER = 10;

type getImageDataReturn =
    | {
        failure: string
        success?: undefined
    }
    | {
        success: ImageData[]
        failure?: undefined
    }

const zodScheme = z.number().optional();

export async function getImagesDataAction(unparsedCursor?: number): Promise<getImageDataReturn> {
    try {
        const cursor = zodScheme.parse(unparsedCursor);
        const { userId } = await auth();

        if (!userId) {
            return { failure: "User not authenticated" };
        }

        const imagesData = await db
            .select({
                imageURL: images.imageURL,
                imageId: images.id,
                createdAt: images.createdAt,
            })
            .from(images)
            .where(
                and(
                    eq(images.userId, userId),
                    eq(images.draft, false),
                    cursor ? lt(images.createdAt, new Date(cursor)) : undefined,
                ),
            )
            .limit(PAGINATION_NUMBER)
            .orderBy(desc(images.createdAt));
        const bucketName = env.MY_AWS_PROCESSED_IMAGES_BUCKET_NAME;

        const presignedImagesData: ImageData[] = await Promise.all(
            imagesData.map(async (imageData) => {
                const command = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: imageData.imageURL,
                });
                const url = await getSignedUrl(s3, command, { expiresIn: 300 });
                return {
                    createdAt: imageData.createdAt.getTime(),
                    imageId: imageData.imageId,
                    imageURL: url,
                };
            }),
        );

        return {
            success: presignedImagesData,
        };
    } catch (err) {
        console.error("Error while getting images", err);
        return { failure: "Something has throw" };
    }
}
