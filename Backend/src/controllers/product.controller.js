import productModel from "../models/product.models.js";
import { uploadImage } from "../services/storage.service.js";

export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body
    const seller = req.user

    console.log("req.files received:", req.files?.length, req.files?.map(f => f.originalname))

    const image = await Promise.all((req.files || []).map(async (file) => {
        const result = await uploadImage({
            buffer: file.buffer,
            fileName: file.originalname
        })
        console.log("ImageKit full result keys:", Object.keys(result))
        console.log("result.url:", result.url)
        return { url: result.url }
    }))

    console.log("Final image array to save:", JSON.stringify(image))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },

        image,

        seller: seller._id
    })

    res.status(201).json({
        Message: "Product created successfully",
        success: true,
        product
    })

}

export async function getSellerProduct(req, res) {

    const seller = req.user

    const products = await productModel.find({
        seller: seller._id
    })

    res.status(200).json({
        Message: "Seller products retrieved successfully",
        success: true,
        products

    })

}

export async function getProducts(req, res) {
    const products = await productModel.find()
    res.status(200).json({
        Message: "All products retrieved successfully",
        success: true,
        products
    })
}

export async function getProductDetails(req, res) {
    const { id } = req.params
    const product = await productModel.findById(id)

    res.status(200).json({
        Message: "Product details retrieved successfully",
        success: true,
        product
    })
}


export async function addProductVariants (req, res) {
    
    const productId = req.params.productId

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user.id
    })

    if (!product) {
        return res.status(404).json({
            Message: "Product not found",
            success: false
        })
    }
    const files = req.files
    const images = []

    if (files || files.length !== 0) {
        (await Promise.all(files.map(async (file) => {
          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
          })
          
          return image

        }))).map(image => images.push(image))
    }



    const price = req.body.priceAmount
    const stock = req.body.stock
    const attributes = JSON.parse(req.body.attributes || "{}")


    console.log(price, stock, attributes, images, product)
}