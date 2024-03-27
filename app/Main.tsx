import { getImagesUrlAction } from "@/actions/getImages";
import ImageCard from "@/components/ImageCard";
import UploadImage from "@/components/UploadImage";

export default async function Main() {
    const imageUrl = await getImagesUrlAction()

    function generateImages() {
        if (imageUrl.failure !== undefined) {
            return null
        }
        return imageUrl.success.map((url, index) => <ImageCard className="rounded-md shadow-md transition hover:scale-110" src={url} key={index} />)
    }

    return (
        <main className="container mx-auto flex items-start flex-col gap-10 justify-center">
            <UploadImage />
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-items-center gap-x-7 gap-y-12">
                {generateImages()}
            </div>
        </main>
    )
}