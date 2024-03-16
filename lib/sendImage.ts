import getSignedURL from "@/actions/getSignedURLAction";

export default async function sendImage(file: File) {
    try {
        //statusmessage(uploading file)
        //setLoading(true)
        const signedURLResult = await getSignedURL()
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