import mongoose from "mongoose"

const collection = "products";

const productSchema = new mongoose.Schema ({
            title: String,
            description: String,
            price: Number,
            thumbnail: {
                type: String,
                unique: true},
            code: Number,
            stock: Number
})

const productModel = mongoose.model(collection, productSchema)

export default productModel;