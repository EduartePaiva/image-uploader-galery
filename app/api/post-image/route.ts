import { NextResponse } from "next/server"
import fs from 'node:fs';

export async function POST(request: Request) {
    const file = (await request.formData()).get('file')
    console.log(file)
    console.log(typeof file)


    // fs.write(, buffer, err => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         // file written successfully
    //     }
    // });


    return new NextResponse("recebido", { status: 201 })
}