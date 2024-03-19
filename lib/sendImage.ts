import getSignedURL from "@/actions/getSignedURLAction";


const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    return hashHex
}


/**
 * This function can throw an error
 * @param file 
 * 
 * @throws {Error} When there's a error while uploading a file
 */
export default async function sendImage(file: File, x1: string, x2: string, portraitWidth: string) {
    //statusmessage(uploading file)
    //setLoading(true)
    const checksum = await computeSHA256(file)
    const signedURLResult = await getSignedURL(
        file.type,
        file.size,
        checksum,
        x1,
        x2,
        portraitWidth,
    )
    if (signedURLResult.failure !== undefined) {
        throw (new Error(signedURLResult.failure))
    }
    const url = signedURLResult.success.url

    console.log(url)
    const result = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        }
    })

    const status = result.status
    if (status !== 200) {
        const statusText = result.statusText
        throw (new Error(statusText))
    }
    //setStatusMessage
}