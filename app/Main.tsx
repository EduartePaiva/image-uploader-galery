import LoadImages from "@/components/load-images";
import UploadImage from "@/components/upload-image";
import ImageStoreContextProvider from "@/context/image-store-context";

export default async function Main() {
    return (
        <main className="container mx-auto grid gap-6">
            <ImageStoreContextProvider>
                <UploadImage />
                <LoadImages />
            </ImageStoreContextProvider>
        </main>
    );
}
