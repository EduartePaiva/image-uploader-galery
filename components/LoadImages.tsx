'use client'

import toast from "react-hot-toast";
import { AlertDialogConfirm } from "./AlertDialogConfirm";
import ImageCard from "./ImageCard";
import { useState } from "react";
import { deleteImageAction } from "@/actions/deleteImage";
import { useRouter } from "next/navigation";

interface LoadImagesProps {
    images: {
        imageURL: string;
        imageId: string;
    }[]
}

async function downloadClick(imageId: string) {
    console.log("Downloading image:" + imageId)

}

export default function LoadImages({ images }: LoadImagesProps) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [currentImageClick, setCurrentImageClick] = useState("")
    const router = useRouter()

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
                    } else {
                        toast.error("Could not delete image!", { id: toastId })
                    }
                    console.log(result)
                }}
            />
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-center gap-x-7 gap-y-12">
                {images.map((image, index) =>
                    <ImageCard
                        key={index}
                        deleteClick={deleteClick}
                        downloadClick={downloadClick}
                        imageId={image.imageId}
                        src={image.imageURL}
                    />)}
            </div>
        </>
    )
}