'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import ImageDialog from '@/components/ImageDialog';
import sendImage from '@/lib/sendImage';

export default function UploadImage() {
    const inputElem = useRef<null | HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState("")
    const [imgWidth, setImageWidth] = useState(0)
    const [imgHigh, setImageHigh] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)

    const buttonClick = () => {
        if (inputElem.current == null) return
        inputElem.current.click()
    }

    const inputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        URL.revokeObjectURL(imageUrl)
        const url2 = URL.createObjectURL(file)
        const img = new Image()
        img.src = url2
        img.onload = () => {
            setImageWidth(img.width)
            setImageHigh(img.height)
            setImageUrl(url2)
            setOpenDialog(true)
        }
    }

    return (
        <div>
            <input
                className="bg-transparent flex-1 border-none outline-none hidden"
                type="file"
                accept='image/jpeg,image/png,image/webp'
                onChange={inputOnChange}
                ref={inputElem}
                onClick={(e) => e.currentTarget.value = ""}
            />
            <Button
                variant={'outline'}
                onClick={buttonClick}
            >
                Select Image
            </Button>
            <ImageDialog
                imageUrl={imageUrl}
                open={openDialog}
                setOpen={setOpenDialog}
                imageHigh={imgHigh}
                imageWidth={imgWidth}
                sendImage={() => {
                    if (inputElem.current && inputElem.current.files && inputElem.current.files.length == 1)
                        sendImage(inputElem.current.files[0])
                }}
            />
        </div>
    )
}
