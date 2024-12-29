"use client";

import { useState } from "react";

import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { deleteImageAction } from "@/actions/delete-image";
import { getImagePresignedUrlAction } from "@/actions/get-image-presigned-url";
import { useImageStoreContext } from "@/context/image-store-context";
import useInfiniteImagesSchorl from "@/hooks/use-infinite-smages-schorl";
import useIntersectionObserver from "@/hooks/use-intersection-observer";

import { AlertDialogConfirm } from "./alert-dialog-confirm";
import ImageCard from "./image-card";
import ImageCardSkeleton from "./image-card-skeleton";

async function downloadClick(imageId: string) {
    const toastId = toast.loading("Downloading...");
    const response = await getImagePresignedUrlAction(imageId);
    if (response.success !== undefined) {
        //do the stuff to download the image on the  page
        const anchorElement = document.createElement("a");
        anchorElement.href = response.success;
        anchorElement.download = "image.jpg";
        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
        toast.success("Image downloaded!", { id: toastId });
    } else {
        toast.error(response.failure, { id: toastId });
    }
}

export default function LoadImages() {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [currentImageClick, setCurrentImageClick] = useState("");
    const { user } = useUser();
    const { images, removeOneImageFromImages } = useImageStoreContext();
    const { hasNextPage, isFetching, fetchMoreImages } = useInfiniteImagesSchorl();

    function deleteClick(imageId: string) {
        setCurrentImageClick(imageId);
        setConfirmDelete(true);
    }
    const { elementRef } = useIntersectionObserver<HTMLDivElement>({
        callback: fetchMoreImages,
        hasNextPage,
        isFetching,
    });

    return (
        <>
            <AlertDialogConfirm
                onOpenChange={setConfirmDelete}
                open={confirmDelete}
                onConfirm={async () => {
                    const toastId = toast.loading("Deleting...");
                    const result = await deleteImageAction(currentImageClick);
                    if (result.success !== undefined) {
                        toast.success("Image deleted!", { id: toastId });
                        removeOneImageFromImages(result.success.imageId);
                        user?.reload();
                    } else {
                        toast.error("Could not delete image!", { id: toastId });
                    }
                }}
            />
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start justify-items-center gap-x-7 gap-y-12">
                {images.map((image) => (
                    <ImageCard
                        key={image.imageId}
                        deleteClick={deleteClick}
                        downloadClick={downloadClick}
                        imageId={image.imageId}
                        src={image.imageURL}
                    />
                ))}

                {images.length === 0 && !isFetching && !hasNextPage && (
                    <span className="justify-self-center text-lg font-semibold">
                        Seems like it&apos;s your first upload, try uploading one image
                    </span>
                )}
                {hasNextPage && (
                    <div ref={elementRef}>
                        <ImageCardSkeleton />
                    </div>
                )}
            </div>
        </>
    );
}
