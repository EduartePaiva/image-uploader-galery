import { getImagesDataAction } from "@/actions/getImages";
import LoadImages from "@/components/LoadImages";
import UploadImage from "@/components/UploadImage";


export default async function Main() {
    const imagesData = await getImagesDataAction()
    if (!(imagesData.success !== undefined && imagesData.success.length > 0))
        return <h1>Seems like you don't have any image.</h1>

    return (
        <main className="container mx-auto flex items-start flex-col gap-6 justify-center">
            <UploadImage />
            <LoadImages images={imagesData.success} />
        </main>
    )
}