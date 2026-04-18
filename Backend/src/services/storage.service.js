import ImageKit from "@imagekit/nodejs"
import { config } from "../config/config.js"


const client = new ImageKit({
    privateKey: config.IMAGEKIT_KEY,
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
})


export async function uploadImage({buffer, folder = "Voidwear", fileName}) {

    const base64 = buffer.toString('base64')

    const result = await client.files.upload({
        file: base64,
        fileName,
        folder
    })

    console.log("ImageKit result.url:", result.url)

    return result

}