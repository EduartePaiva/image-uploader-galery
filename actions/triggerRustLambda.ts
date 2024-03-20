'use server'


import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda"; // ES Modules import
const client = new LambdaClient({
    region: process.env.AWS_LAMBDA_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});






export default async function triggerRustLambda(image_name: string) {
    const input: InvokeCommandInput = { // InvocationRequest
        FunctionName: process.env.AWS_LAMBDA_NAME!, // required
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify({ image_name: image_name }))// e.g. Buffer.from("") or new TextEncoder().encode("")
    };
    //console.log(input.ClientContext)
    const command = new InvokeCommand(input);
    const response = await client.send(command);


    if (response.StatusCode && response.StatusCode === 200) {
        console.log('RUST LAMBDA EXECUTED')
    }


    // { // InvocationResponse
    //   StatusCode: Number("int"),
    //   FunctionError: "STRING_VALUE",
    //   LogResult: "STRING_VALUE",
    //   Payload: new Uint8Array(),
    //   ExecutedVersion: "STRING_VALUE",
    // };



}