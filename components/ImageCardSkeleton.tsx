import Image from "next/image"
import { Button } from "./ui/button"
import { Download, Trash2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

export default function ImageCardSkeleton() {
    return (
        <Skeleton>
            <div className={"rounded-md shadow-md transition hover:scale-110 bg-secondary"}>
                <Image
                    className="rounded-t-md"
                    width={400}
                    height={400}
                    src={
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcsnPnNAAGzQKu3HC/iQAAAABJRU5ErkJggg=="
                    }
                    alt="picture"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcsnPnNAAGzQKu3HC/iQAAAABJRU5ErkJggg=="
                />
                <div className="flex gap-2 p-1 justify-end">
                    <Button className="hover:text-lime-500" variant={"ghost"} size={"icon"}>
                        <Download />
                    </Button>
                    <Button className="hover:text-destructive" variant={"ghost"} size={"icon"}>
                        <Trash2 />
                    </Button>
                </div>
            </div>
        </Skeleton>
    )
}
