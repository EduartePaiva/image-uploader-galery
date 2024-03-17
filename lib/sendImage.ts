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

export default async function sendImage(file: File) {
    try {
        //statusmessage(uploading file)
        //setLoading(true)
        const checksum = await computeSHA256(file)
        const signedURLResult = await getSignedURL(
            file.type,
            file.size,
            checksum
        )
        if (signedURLResult.failure !== undefined) {
            throw (new Error(signedURLResult.failure))
        }
        const url = signedURLResult.success.url
        await fetch(url, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type
            }
        })
        //setStatusMessage
    } catch (e) {
        //setStatusmessage(failed)
        console.log(e)
    } finally {
        //setLoading(false)
    }





    // const formData = new FormData()
    // formData.append('file', file);
    // try {
    //     const result = await fetch('api/post-image', {
    //         method: "POST",
    //         headers: {},
    //         body: formData
    //     })

    //     console.log(result)
    // } catch (err) {
    //     console.log(err);
    // }


}