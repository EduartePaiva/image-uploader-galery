'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import ImageDialog from '@/components/ImageDialog';

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
                className="hidden"
                type="file"
                id='input'
                ref={inputElem}
                accept='image/*'
                onChange={inputOnChange}
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
            />
        </div>
    )
}
