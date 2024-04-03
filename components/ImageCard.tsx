import Image from "next/image";
import { Button } from "./ui/button";
import { Download, Trash2 } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";
interface ImageCardProps {
    src: string,
    imageId: string;
    deleteClick: (imageId: string) => void;
    downloadClick: (imageId: string) => Promise<void>;
}

export default function ImageCard({ src, imageId, deleteClick, downloadClick }: ImageCardProps) {
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
                    <Button
                        className="hover:text-lime-500"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => downloadClick(imageId)}
                    >
                        <Download />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper tooltipMessage="Delete Image">
                    <Button
                        className="hover:text-destructive"
                        onClick={() => deleteClick(imageId)}
                        variant={"ghost"}
                        size={"icon"}
                    >
                        <Trash2 />
                    </Button>
                </TooltipWrapper>
            </div>
        </div>
    )
}