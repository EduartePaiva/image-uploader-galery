import { getImagesDataAction } from "@/actions/getImages";
import ImageCard from "@/components/ImageCard";
import UploadImage from "@/components/UploadImage";

export default async function Main() {
    const imagesData = await getImagesDataAction()

    function generateImages() {
        if (imagesData.failure !== undefined) {
            console.log("Failed to get ImagesData")
            return null
        }
        return imagesData.success
            .map((imageData, index) =>
                <ImageCard
                    src={imageData.imageURL}
                    imageId={imageData.imageId}
                    key={index}
                />
            )
    }

    return (
        <main className="container mx-auto flex items-start flex-col gap-6 justify-center">
            <UploadImage />
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-center gap-x-7 gap-y-12">
                {generateImages()}
            </div>
        </main>
    )
}