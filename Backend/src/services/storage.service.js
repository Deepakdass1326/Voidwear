import ImageKit from "@imagekit/nodejs"
import { config } from "../config/config.js"


const client = new ImageKit({
    privateKey: config.IMAGEKIT_KEY
})


export async function uploadImage({buffer, folder = "Voidwear", fileName}) {

    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result

}