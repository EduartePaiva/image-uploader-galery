'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import ImageDialog from '@/components/ImageDialog';
import { ImagePlus } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { canUserUploadImage } from '@/utils/client_utils/checkIfUserCanUpload';


export default function UploadImage() {
    const inputElem = useRef<null | HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
    const [imgWidth, setImageWidth] = useState(0)
    const [imgHigh, setImageHigh] = useState(0)
    const [imgFile, setImgFile] = useState<undefined | File>();
    const [openDialog, setOpenDialog] = useState(false)
    const { user } = useUser();

    const buttonClick = () => {
        if (!canUserUploadImage(user)) {
            toast.error(<p className='text-center'>Your can&apos;t upload more images. Try deleting one image so you can upload more.</p>)
            return
        }
        if (inputElem.current == null) return
        inputElem.current.click()
    }

    const inputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        if (imageUrl) URL.revokeObjectURL(imageUrl)
        const new_url = URL.createObjectURL(file)
        const img = new Image()
        img.src = new_url
        img.onload = () => {
            setImgFile(file)
            setImageWidth(img.width)
            setImageHigh(img.height)
            setImageUrl(new_url)
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
                size={'lg'}
                className='flex gap-4'
            >
                <ImagePlus /><span className='text-lg'>Add Image</span>
            </Button>
            {imageUrl && imgFile && <ImageDialog
                imageUrl={imageUrl}
                open={openDialog}
                setOpen={setOpenDialog}
                imageHigh={imgHigh}
                imageWidth={imgWidth}
                image_file={imgFile}
            />}
        </div>
    )
}
