import Image from "next/image";

interface ImageCardProps {
    src: string,
}

export default function ImageCard({ src }: ImageCardProps) {
    return (
        <Image
            width={400}
            height={400}
            src={src}
            alt="picture"
        />
    )
}