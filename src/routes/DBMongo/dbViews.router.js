import { Router } from "express"
import productModel from "../../dao/models/products.model.js"

const router = Router()

router.get("/", async (req, res) => {
    res.render("home")
})

router.get("/products", async (req, res) => {
    const products = await productModel.find().lean()
    res.render("realTimeProducts", { products })
})

router.get("/chat", async (req, res) => {
    res.render("chat")
})

export default router 