import { getImagesDataAction } from "@/actions/getImages";
import LoadImages from "@/components/LoadImages";
import UploadImage from "@/components/UploadImage";


export default async function Main() {
    const imagesData = await getImagesDataAction()
    if (imagesData.success === undefined) {
        return (
            <main className="container">
                <h1>Server error while download the images</h1>
                <p>Please try reloading the page and awaiting a bit. If problem persists contact the administrator</p>
            </main>
        )
    }

    return (
        <main className="container mx-auto grid gap-6">
            <UploadImage />
            {imagesData.success.length > 0 ?
                <LoadImages images={imagesData.success} /> :
                <span className="justify-self-center text-lg font-semibold">Seems like it&apos;s your first upload, try uploading one image</span>
            }
        </main>
    )
}