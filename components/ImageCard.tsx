'use client'

import Image from "next/image";
import { Button } from "./ui/button";
import { Download, Trash2 } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";
import { deleteImageAction } from "@/actions/deleteImage";
import { AlertDialogConfirm } from "./AlertDialogConfirm";
import { useState } from "react";

interface ImageCardProps {
    src: string,
    imageId: string;
}

export default function ImageCard({ src, imageId }: ImageCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false)

    const deleteClick = () => {
        setConfirmDelete(true)
    }

    return (
        <div className={"rounded-md shadow-md transition hover:scale-110 bg-secondary"}>
            <Image
                className="rounded-t-md"
                width={400}
                height={400}
                src={src}
                alt="picture"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcsnPnNAAGzQKu3HC/iQAAAABJRU5ErkJggg=="
            />
            <div className="flex gap-2 p-1 justify-end">
                <TooltipWrapper tooltipMessage="Download Image">
                    <Button variant={"ghost"} size={"icon"}>
                        <Download />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltipMessage="Delete Image">
                    <Button onClick={deleteClick} variant={"ghost"} size={"icon"}><Trash2 /></Button>
                </TooltipWrapper>
                <AlertDialogConfirm
                    onOpenChange={setConfirmDelete}
                    open={confirmDelete}
                    onConfirm={async () => {
                        const result = await deleteImageAction(imageId)
                        console.log(result)
                    }}
                />
            </div>
        </div>
    )
}