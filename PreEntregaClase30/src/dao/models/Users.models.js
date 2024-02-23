import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    fullName: String,
    email:String,
    age:Number,
    password:String,
    role:String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" }
})

const userModel = mongoose.model(collection,schema);

export default userModel;