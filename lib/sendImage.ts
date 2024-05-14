import getSignedURL from "@/actions/getSignedURLAction"

const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    return hashHex
}

/**
 * This function can throw an error
 * @param file
 *
 * @throws {Error} When there's a error while uploading a file
 */
export default async function sendImage(
    file: File,
    x1: string,
    y1: string,
    portrait_width: string,
    portrait_hight: string,
) {
    const checksum = await computeSHA256(file)
    const signedURLResult = await getSignedURL({
        type: file.type,
        size: file.size,
        checksum,
        x1,
        y1,
        portraitWidth: portrait_width,
        portraitHight: portrait_hight,
    })
    if (signedURLResult.failure !== undefined) {
        throw new Error(signedURLResult.failure)
    }
    const url = signedURLResult.success.url
    const draftPostId = signedURLResult.success.postId
    const result = await fetch(url, {
        method: "PUT",
        body: file,
        mode: "cors",
        headers: {
            "Content-Type": file.type,
        },
    })

    const status = result.status
    if (status !== 200) {
        const statusText = result.statusText
        throw new Error(statusText)
    }

    return draftPostId
}
