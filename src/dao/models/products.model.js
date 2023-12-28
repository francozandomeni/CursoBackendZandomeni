import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const collection = "products";

const productSchema = new mongoose.Schema ({
            title: {
                type: String,
                require: true,
            },
            description: {
                type: String,
                require: true,
            },
            price: {
                type: Number,
                require: true,
            },
            thumbnail: {
                type: String,
                unique: true},
            code: {
                type: Number,
                require: true,
            },
            stock: {
                type: Number,
                require: true,
            },
            category: {
                type: String,
                require: true,
            }
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, productSchema)

export default productModel;