import LoadImages from "@/components/LoadImages"
import UploadImage from "@/components/UploadImage"
import ImageStoreContextProvider from "@/context/image-store-context"

export default async function Main() {
    // const imagesData = await getImagesDataAction("ecf236cf-2d70-4bee-bf3c-200a8faf10fa")
    // if (imagesData.success === undefined) {
    //     return (
    //         <main className="container">
    //             <h1>Server error while download the images</h1>
    //             <p>Please try reloading the page and awaiting a bit. If problem persists contact the administrator</p>
    //         </main>
    //     )
    // }

    return (
        <main className="container mx-auto grid gap-6">
            <ImageStoreContextProvider>
                <UploadImage />
                <LoadImages />
            </ImageStoreContextProvider>
        </main>
    )
}
