import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import "@/components/imageDialog.css"
import { useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";

interface ImageDialogProps {
    open: boolean;
    imageUrl: string;
    imageWidth: number;
    imageHigh: number;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sendImage: () => void
}


export default function ImageDialog({ open, imageUrl, setOpen, imageHigh, imageWidth, sendImage }: ImageDialogProps) {
    const imgRef = useRef<null | HTMLImageElement>(null);
    const [imgZoomIn, setImgZoomIn] = useState(1);
    const widthCalc = (imageWidth / imageHigh) * 400
    const portraitBoundary = widthCalc < 400 ? widthCalc : 400
    const maxMoveX = (widthCalc * imgZoomIn - portraitBoundary) / 2
    // (heigh of the image - portraitBoundary) / 2
    const maxMoveY = (400 * imgZoomIn - portraitBoundary) / 2
    const [translateX, setTranslateX] = useState(0)
    const [translateY, setTranslateY] = useState(0)


    useEffect(() => {
        if (imgRef.current == null) return
        const moveX = (translateX > -maxMoveX && translateX < maxMoveX) ? translateX : (translateX < 0) ? -maxMoveX : maxMoveX
        const moveY = (translateY > -maxMoveY && translateY < maxMoveY) ? translateY : (translateY < 0) ? -maxMoveY : maxMoveY
        if (moveX != translateX || moveY != translateY) {
            console.log('use effect')
            imgRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
            setTranslateX(moveX)
            setTranslateY(moveY)
        }
    }, [imgZoomIn])


    const onMouseDown = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (imgRef.current == null) return
        const shiftX = e.clientX - translateX
        const shiftY = e.clientY - translateY

        let newTranslateX = 0
        let newTranslateY = 0


        imgRef.current.ondragstart = function () {
            return false
        }

        function moveAt(pageX: number, pageY: number) {
            if (imgRef.current == null) return
            const moveX = (pageX > -maxMoveX && pageX < maxMoveX) ? pageX : (pageX < 0) ? -maxMoveX : maxMoveX
            const moveY = (pageY > -maxMoveY && pageY < maxMoveY) ? pageY : (pageY < 0) ? -maxMoveY : maxMoveY
            newTranslateX = moveX
            newTranslateY = moveY
            imgRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
        }

        function onMouseMove(event: MouseEvent) {
            moveAt(event.pageX - shiftX, event.pageY - shiftY)
        }

        window.onmousemove = onMouseMove
        window.onmouseup = function () {
            setTranslateX(newTranslateX)
            setTranslateY(newTranslateY)
            window.onmousemove = null
            window.onmouseup = null
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            setTranslateX(0)
            setTranslateY(0)
            setImgZoomIn(1)
            setOpen(open)
        }}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="
                p-0
                rounded-[5px,5px,0,0]
                min-h-0
                flex-[1,1,auto]"

            >
                <DialogTitle className="font-medium p-3">Edit image</DialogTitle>
                <div className="bg-gray-950 m-3 image-container">
                    {/* Image goes here */}
                    <img
                        draggable={false}
                        style={{
                            minWidth: (imageWidth / imageHigh) * 400 * imgZoomIn,
                            width: (imageWidth / imageHigh) * 400 * imgZoomIn,
                            height: 400 * imgZoomIn,
                            transform: "translate(0px, 0px)"
                        }}
                        className="h-full min-w-[700px] cursor-grab select-none absolute"
                        src={imageUrl}
                        alt="uploaded image"
                        onMouseDown={onMouseDown}
                        ref={imgRef}
                    />
                    <div
                        className="overlay"
                        style={{
                            height: portraitBoundary,
                            width: portraitBoundary,

                        }}
                    ></div>
                </div>
                <div className="mx-3">
                    <Slider onValueChange={(value) => setImgZoomIn(1 + (value[0] / 100))} />
                </div>

                <div className={cn("bg-gray-100 p-3 flex justify-end")}>
                    {/* Buttons goes here */}
                    <DialogClose asChild><Button className="text-muted-foreground font-normal" variant={"link"}>Cancel</Button></DialogClose>
                    <Button
                        variant={"default"}
                        className="rounded-sm"
                        onClick={() => {
                            if (imgRef.current == null) return
                            // what I have to do?
                            // First I have to find X1, X2, Y1, Y2
                            // Then I have to turn this real, which means the real image size
                            // Let's first work without resizing in mind
                            const curImageWidth = widthCalc * imgZoomIn
                            const curImageHeight = 400 * imgZoomIn

                            // regra de 3 em portraitBoundary, translateX e translateY
                            const originPortraitB = (portraitBoundary * imageWidth) / curImageWidth
                            const originTX = (translateX * imageWidth) / curImageWidth
                            const originTY = (translateY * imageHigh) / curImageHeight


                            //starting point idea
                            const x1 = ((imageWidth - originPortraitB) / 2) - originTX
                            const y1 = ((imageHigh - originPortraitB) / 2) - originTY



                            console.log("originTX: ", originTX)
                            console.log("TranslateY: ", translateY)
                            console.log("X1 is: ", x1);
                            console.log("Y1 is: ", y1)

                            sendImage();


                        }}
                    >Apply</Button>

                </div>
            </DialogContent>
        </Dialog >
    )
}