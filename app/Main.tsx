import { getImagesUrlAction } from "@/actions/getImages";
import ImageCard from "@/components/ImageCard";
import UploadImage from "@/components/UploadImage";

export default async function Main() {
    const imageUrl = await getImagesUrlAction()

    function generateImages() {
        if (imageUrl.failure !== undefined) {
            return null
        }
        return imageUrl.success.map((url, index) => <ImageCard src={url} key={index} />)
    }

    return (
        <main className="flex items-center flex-col gap-10">
            <UploadImage />
            <h1 className="text-2xl font-bold">My Images</h1>
            <div className="w-full">
                {generateImages()}
            </div>
        </main>
    )
}