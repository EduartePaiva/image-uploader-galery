export default async function sendImage(file: File) {
    const formData = new FormData()
    formData.append('file', file);
    try {
        const result = await fetch('api/post-image', {
            method: "POST",
            headers: {},
            body: formData
        })

        console.log(result)
    } catch (err) {
        console.log(err);
    }


}