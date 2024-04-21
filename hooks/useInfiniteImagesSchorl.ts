import { useState } from "react"
import { getImagesDataAction } from "@/actions/getImages"
import { useImageStoreContext } from "@/context/image-store-context"

export default function useInfiniteImagesSchorl() {
    const { images, appendImagesToTheEnd } = useImageStoreContext()
    const [isFetching, setIsFetching] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [error, setError] = useState<undefined | string>()

    const fetchMoreImages = async () => {
        if (isFetching) return
        setIsFetching(true)
        const cursor = images.length > 0 ? images[images.length - 1].createdAt : undefined

        const newImages = await getImagesDataAction(cursor)
        if (newImages.failure !== undefined) {
            setError(newImages.failure)
            setIsFetching(false)
            console.error(newImages.failure)
            return
        }
        if (newImages.success.length < 10) {
            setHasNextPage(false)
        }
        appendImagesToTheEnd(newImages.success)
        setIsFetching(false)
    }
    return {
        images,
        isFetching,
        hasNextPage,
        error,
        fetchMoreImages,
    }
}
