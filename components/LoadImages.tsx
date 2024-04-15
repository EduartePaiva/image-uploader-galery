"use client"

import toast from "react-hot-toast"
import { AlertDialogConfirm } from "./AlertDialogConfirm"
import ImageCard from "./ImageCard"
import { useCallback, useRef, useState } from "react"
import { deleteImageAction } from "@/actions/deleteImage"
import { getImagePresignedUrlAction } from "@/actions/getImagePresignedUrl"
import { useUser } from "@clerk/nextjs"
import { useImageStoreContext } from "@/context/image-store-context"
import useInfiniteImagesSchorl from "@/hooks/useInfiniteImagesSchorl"
import ImageCardSkeleton from "./ImageCardSkeleton"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"

async function downloadClick(imageId: string) {
    console.log("Downloading image:" + imageId)
    const toastId = toast.loading("Downloading...")
    const response = await getImagePresignedUrlAction(imageId)
    if (response.success !== undefined) {
        //do the stuff to download the image on the  page
        const anchorElement = document.createElement("a")
        anchorElement.href = response.success
        anchorElement.download = "image.jpg"
        document.body.appendChild(anchorElement)
        anchorElement.click()
        document.body.removeChild(anchorElement)
        toast.success("Image downloaded!", { id: toastId })
    } else {
        toast.error(response.failure, { id: toastId })
    }
}

export default function LoadImages() {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [currentImageClick, setCurrentImageClick] = useState("")
    const { user } = useUser()
    const { images, removeOneImageFromImages } = useImageStoreContext()
    const { error, hasNextPage, isFetching, fetchMoreImages } = useInfiniteImagesSchorl()

    function deleteClick(imageId: string) {
        setCurrentImageClick(imageId)
        setConfirmDelete(true)
    }
    const { elementRef } = useIntersectionObserver<HTMLDivElement>({
        callback: fetchMoreImages,
        hasNextPage,
        isFetching,
    })

    // // observer logic
    // const observer = useRef<IntersectionObserver | null>(null)
    // const lastElementRef = useCallback(
    //     (node: HTMLDivElement | null) => {
    //         if (node === null) return
    //         if (isFetching) return
    //         if (observer.current !== null) {
    //             console.log("disconnecting observer", observer)
    //             observer.current.disconnect()
    //         }
    //         console.log("creating observer")
    //         observer.current = new IntersectionObserver((entries) => {
    //             if (entries[0].isIntersecting && hasNextPage) {
    //                 console.log("calling fetch more images")
    //                 fetchMoreImages()
    //             }
    //         })
    //         observer.current.observe(node)
    //     },
    //     [isFetching, observer, fetchMoreImages, hasNextPage],
    // )

    return (
        <>
            <AlertDialogConfirm
                onOpenChange={setConfirmDelete}
                open={confirmDelete}
                onConfirm={async () => {
                    const toastId = toast.loading("Deleting...")
                    const result = await deleteImageAction(currentImageClick)
                    if (result.success !== undefined) {
                        toast.success("Image deleted!", { id: toastId })
                        removeOneImageFromImages(result.success.imageId)
                        user?.reload()
                    } else {
                        toast.error("Could not delete image!", { id: toastId })
                    }
                }}
            />
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-center items-start gap-x-7 gap-y-12">
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
    )
}
