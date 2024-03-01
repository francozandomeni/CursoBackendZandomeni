import {generateProduct } from "../config/faker.js"

const mockingProducts = async (req, res) => {

    const cant = parseInt(req.query.cant) || 100
    let products = []

    try {
        for (let i = 0; i < cant; i++) {
            const product = generateProduct()
            products.push(product)
        }
        res.json({ status: "success", payload: products })

    } catch (error) {
        console.error(error)
        res.status(400).res.json("error en el mocking")
    }


}

export {mockingProducts}