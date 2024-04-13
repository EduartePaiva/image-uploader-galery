"use client"
import type { ImageData } from '@/types/types.t'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';


interface ImageStoreContext {
    images: ImageData[];
    setImages: Dispatch<SetStateAction<ImageData[]>>
}

const ImageStoreContext = createContext<ImageStoreContext | null>(null)

interface ImageContextProviderProps {
    children: React.ReactNode
}

export default function ImageStoreContextProvider({ children }: ImageContextProviderProps) {
    const [images, setImages] = useState<ImageData[]>([])
    return (
        <ImageStoreContext.Provider value={{ images, setImages }}>
            {children}
        </ImageStoreContext.Provider>
    )
}

export function useImageStoreContext() {
    const context = useContext(ImageStoreContext)
    if (!context) {
        console.error("useImageStoreContext must be used within a ImageStoreContextProvider");
        throw new Error("useImageStoreContext must be used within a ImageStoreContextProvider")
    }
    const { images, setImages } = context

    const appendImagesToTheEnd = (newImages: ImageData[]) => {
        setImages(prevImages => [...prevImages, ...newImages])
    }
    const removeOneImageFromImages = (imageId: string) => {
        setImages(prevImages => {
            const indexToRemove = prevImages.findIndex(image => image.imageId === imageId)
            prevImages.splice(indexToRemove, 1);
            return [...prevImages]
        })
    }
    const addOneImageToTheStart = (image: ImageData) => {
        setImages(prevImage => [image, ...prevImage])
    }


    return {
        images,
        appendImagesToTheEnd,
        removeOneImageFromImages,
        addOneImageToTheStart
    }
}

