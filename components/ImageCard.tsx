import Image from "next/image";

interface ImageCardProps {
    src: string,
    className?: string
}

export default function ImageCard({ src, className }: ImageCardProps) {
    return (
        <Image
            className={className}
            width={400}
            height={400}
            src={src}
            alt="picture"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcsnPnNAAGzQKu3HC/iQAAAABJRU5ErkJggg=="
        />
    )
}