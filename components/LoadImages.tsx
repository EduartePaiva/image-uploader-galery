"use client"

import toast from "react-hot-toast";
import { AlertDialogConfirm } from "./AlertDialogConfirm";
import ImageCard from "./ImageCard";
import { useState } from "react";
import { deleteImageAction } from "@/actions/deleteImage";
import { useRouter } from "next/navigation";
import { getImagePresignedUrlAction } from "@/actions/getImagePresignedUrl";
import { useUser } from "@clerk/nextjs";
import type { ImageData } from '@/types/types.t'
import useInfiniteSchorl from "@/hooks/useInfiniteSchorl";
import { Button } from "./ui/button";

interface LoadImagesProps {
}

async function downloadClick(imageId: string) {
    console.log("Downloading image:" + imageId)
    const toastId = toast.loading('Downloading...');
    const response = await getImagePresignedUrlAction(imageId)
    if (response.success !== undefined) {
        //do the stuff to download the image on the  page
        const anchorElement = document.createElement('a');
        anchorElement.href = response.success
        anchorElement.download = "image.jpg"
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
        toast.success("Image downloaded!", { id: toastId })
    } else {
        toast.error(response.failure, { id: toastId })
    }

}

export default function LoadImages({ }: LoadImagesProps) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [currentImageClick, setCurrentImageClick] = useState("")
    const router = useRouter()
    const { user } = useUser();

    const {
        error,
        hasNextPage,
        images,
        isFetching,
        loadMoreImages
    } = useInfiniteSchorl()

    function deleteClick(imageId: string) {
        setCurrentImageClick(imageId)
        setConfirmDelete(true)
    }

    return (
        <>
            <AlertDialogConfirm
                onOpenChange={setConfirmDelete}
                open={confirmDelete}
                onConfirm={async () => {
                    const toastId = toast.loading('Deleting...');
                    const result = await deleteImageAction(currentImageClick)
                    if (result.success !== undefined) {
                        toast.success("Image deleted!", { id: toastId })
                        router.refresh()
                        user?.reload()
                    } else {
                        toast.error("Could not delete image!", { id: toastId })
                    }
                    console.log(result)
                }}
            />
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-center items-start gap-x-7 gap-y-12">
                {images.length > 0 ?
                    images.map((image, index) =>
                        <ImageCard
                            key={index}
                            deleteClick={deleteClick}
                            downloadClick={downloadClick}
                            imageId={image.imageId}
                            src={image.imageURL}
                        />
                    ) :
                    <span className="justify-self-center text-lg font-semibold">
                        Seems like it&apos;s your first upload, try uploading one image
                    </span>
                }

            </div>
            <Button
                disabled={(error !== undefined && !isFetching || !hasNextPage)}
                className="w-fit"
                onClick={loadMoreImages}
            >
                Load more
            </Button>
        </>
    )
}