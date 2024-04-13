import { useState } from "react";
import type {ImageData} from '@/types/types.t'
import { getImagesDataAction } from "@/actions/getImages";


export default function useInfiniteSchorl(){
    const [images,setImages] = useState<ImageData[]>([])
    const [isFetching,setIsFetching] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [error, setError] = useState<undefined | string>()

    const loadMoreImages = async () => {
        setIsFetching(true)
        const cursor = images.length > 0 ? images[images.length-1].createdAt : undefined
        const newImages = await getImagesDataAction(cursor)
        if(newImages.failure !== undefined){
            setError(newImages.failure)
            setIsFetching(false)
            console.error(newImages.failure)
            return
        }
        if(newImages.success.length < 10) {
            console.log(newImages.success.length)
            console.log("Images reached the end")
            setHasNextPage(false)
        }
        setImages(prevImages => [...prevImages, ...newImages.success])
        setIsFetching(false)
    }
    return {
        images,
        isFetching,
        hasNextPage,
        error,
        loadMoreImages
    }
}