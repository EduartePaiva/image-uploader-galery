import LoadImages from "@/components/LoadImages"
import UploadImage from "@/components/UploadImage"
import ImageStoreContextProvider from "@/context/image-store-context"

export default async function Main() {
    return (
        <main className="container mx-auto grid gap-6">
            <ImageStoreContextProvider>
                <UploadImage />
                <LoadImages />
            </ImageStoreContextProvider>
        </main>
    )
}
