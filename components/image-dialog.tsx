import { useRef, useState } from "react";

import { useUser } from "@clerk/nextjs";
import { Crop, Image as LucidImage } from "lucide-react";
import toast from "react-hot-toast";

import confirmImageUploaded from "@/actions/confirm-image-uploaded";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useImageStoreContext } from "@/context/image-store-context";
import sendImage from "@/lib/send-image";
import { cn } from "@/lib/utils";

import { Slider } from "./ui/slider";

interface ImageDialogProps {
    open: boolean;
    imageUrl: string;
    imageWidth: number;
    imageHigh: number;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    image_file: File;
}

export default function ImageDialog({
    open,
    imageUrl,
    setOpen,
    imageHigh,
    imageWidth,
    image_file,
}: ImageDialogProps) {
    const imgRef = useRef<null | HTMLImageElement>(null);
    const [imgZoomIn, setImgZoomIn] = useState(1);
    const { user } = useUser();
    const widthCalc = (imageWidth / imageHigh) * 400;
    const portraitBoundary = widthCalc < 400 ? widthCalc : 400;
    const maxMoveX = (widthCalc * imgZoomIn - portraitBoundary) / 2;
    // (heigh of the image - portraitBoundary) / 2
    const maxMoveY = (400 * imgZoomIn - portraitBoundary) / 2;
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const { addOneImageToTheStart } = useImageStoreContext();

    const [sending, setSending] = useState(false);

    const handleImgZoomIn = (value: number[]) => {
        if (imgRef.current == null) return;
        const newZoomInValue = 1 + value[0] / 100;
        const newMaxMoveX = (widthCalc * newZoomInValue - portraitBoundary) / 2;
        const newMaxMoveY = (400 * newZoomInValue - portraitBoundary) / 2;
        const moveX =
            translateX > -newMaxMoveX && translateX < newMaxMoveX
                ? translateX
                : translateX < 0
                  ? -newMaxMoveX
                  : newMaxMoveX;

        const moveY =
            translateY > -newMaxMoveY && translateY < newMaxMoveY
                ? translateY
                : translateY < 0
                  ? -newMaxMoveY
                  : newMaxMoveY;

        if (moveX != translateX || moveY != translateY) {
            imgRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
            setTranslateX(moveX);
            setTranslateY(moveY);
        }
        setImgZoomIn(newZoomInValue);
    };

    const onPointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
        if (imgRef.current == null) return;
        if (!e.isPrimary) return;
        const shiftX = e.clientX - translateX;
        const shiftY = e.clientY - translateY;

        let newTranslateX = 0;
        let newTranslateY = 0;

        imgRef.current.ondragstart = function () {
            return false;
        };

        function moveAt(pageX: number, pageY: number) {
            if (imgRef.current == null) return;
            const moveX =
                pageX > -maxMoveX && pageX < maxMoveX ? pageX : pageX < 0 ? -maxMoveX : maxMoveX;
            const moveY =
                pageY > -maxMoveY && pageY < maxMoveY ? pageY : pageY < 0 ? -maxMoveY : maxMoveY;
            newTranslateX = moveX;
            newTranslateY = moveY;
            imgRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        function onPointerMove(event: MouseEvent) {
            moveAt(event.pageX - shiftX, event.pageY - shiftY);
        }

        window.onpointermove = onPointerMove;
        window.onpointerup = function () {
            setTranslateX(newTranslateX);
            setTranslateY(newTranslateY);
            window.onpointermove = null;
            window.onpointerup = null;
        };
    };

    const closeDialog = (open: boolean = false) => {
        URL.revokeObjectURL(imageUrl);
        setTranslateX(0);
        setTranslateY(0);
        setImgZoomIn(1);
        setOpen(open);
    };

    return (
        <Dialog open={open} onOpenChange={closeDialog}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="min-h-0 flex-[1,1,auto] p-3"
            >
                <DialogTitle className="font-medium">
                    <div className="flex items-center gap-2">
                        <Crop /> <span>Crop Image</span>
                    </div>
                </DialogTitle>
                <div className="relative flex h-[400px] max-h-[500px] min-h-[300px] items-center justify-center overflow-hidden rounded-sm bg-background">
                    {/* Image goes here */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        draggable={false}
                        style={{
                            minWidth: (imageWidth / imageHigh) * 400 * imgZoomIn,
                            width: (imageWidth / imageHigh) * 400 * imgZoomIn,
                            height: 400 * imgZoomIn,
                            transform: "translate(0px, 0px)",
                        }}
                        className="absolute h-full min-w-[700px] cursor-grab select-none"
                        src={imageUrl}
                        alt="uploaded image"
                        onPointerDown={onPointerDown}
                        ref={imgRef}
                    />
                    <div
                        className="overlay pointer-events-none absolute box-border border border-white opacity-100 shadow-[rgba(0,0,0,0.8)0_0_0_9999px]"
                        style={{
                            height: portraitBoundary,
                            width: portraitBoundary,
                        }}
                    ></div>
                </div>
                <div className="mx-6 flex items-center gap-2">
                    <LucidImage size={30} />
                    <Slider onValueChange={handleImgZoomIn} />
                    <LucidImage size={40} />
                </div>

                <div className={cn("flex justify-end")}>
                    {/* Buttons goes here */}
                    <DialogClose asChild>
                        <Button className="font-normal text-muted-foreground" variant={"link"}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className="rounded-sm"
                        disabled={sending}
                        onClick={async () => {
                            if (imgRef.current == null) return;
                            // what I have to do?
                            // First I have to find X1, X2, Y1, Y2
                            // Then I have to turn this real, which means the real image size
                            // Let's first work without resizing in mind
                            const curImageWidth = widthCalc * imgZoomIn;
                            const curImageHeight = 400 * imgZoomIn;

                            // regra de 3 em portraitBoundary, translateX e translateY
                            const originPortraitB = (portraitBoundary * imageWidth) / curImageWidth;
                            const originTX = (translateX * imageWidth) / curImageWidth;
                            const originTY = (translateY * imageHigh) / curImageHeight;

                            //starting point idea
                            const x1 = (imageWidth - originPortraitB) / 2 - originTX;
                            const y1 = (imageHigh - originPortraitB) / 2 - originTY;
                            const newX1 = x1 < 0 ? "0" : Math.trunc(x1).toString();
                            const newY1 = y1 < 0 ? "0" : Math.trunc(y1).toString();
                            const newPortraitWidth = Math.trunc(originPortraitB).toString();
                            const newPortraitHight = newPortraitWidth;

                            const toastId = toast.loading("Saving image...");
                            try {
                                setSending(true);
                                const draftPostId = await sendImage(
                                    image_file,
                                    newX1,
                                    newY1,
                                    newPortraitWidth,
                                    newPortraitHight
                                );

                                toast.loading("Processing image...", {
                                    id: toastId,
                                });
                                const processImageResult = await confirmImageUploaded(draftPostId);
                                if (processImageResult.failure !== undefined) {
                                    console.error(processImageResult.failure);
                                    throw new Error("Error while processing image");
                                }

                                toast.success(<b>Image saved!</b>, {
                                    id: toastId,
                                });

                                addOneImageToTheStart(processImageResult.success.image);
                                closeDialog();
                                user?.reload();
                            } catch (err) {
                                console.error(err);
                                toast.error(<b>Could not save.</b>, {
                                    id: toastId,
                                });
                            } finally {
                                setSending(false);
                            }
                        }}
                    >
                        Apply
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
