'use client'

import Image from "next/image";
import { Button } from "./ui/button";
import { Download, ImageDown, Trash2 } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";

interface ImageCardProps {
    src: string,
    className?: string
}

export default function ImageCard({ src, className }: ImageCardProps) {
    return (
        <div className={"rounded-md shadow-md transition hover:scale-110"}>
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
                    <Button variant={"ghost"} size={"icon"}><Download /></Button>
                </TooltipWrapper>
                <TooltipWrapper tooltipMessage="Delete Image">
                    <Button variant={"ghost"} size={"icon"}><Trash2 /></Button>
                </TooltipWrapper>
            </div>
        </div>
    )
}