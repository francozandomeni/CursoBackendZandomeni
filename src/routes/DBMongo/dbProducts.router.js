import { Router } from "express"
import productModel from "../../dao/models/products.model.js"

const router = Router()

router.get('/', async (req, res) => {


    const products = await productModel.find().lean()

    res.send({
        status: "success",
        message: products
    })

})

router.get('/:pid', async (req, res) => {

    const pid = req.params.pid;

    const product = await productModel.find({_id:pid})

    res.send({
        status: "success",
        message: product
    })

});


router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
        return res.status(400).send({
            status: "error",
            message: "Faltan campos obligatorios"
        })

    }
    const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock

    }

    const result = await productModel.create(product) 



});

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const { title, description, price, thumbnail, code, stock } = req.body;


    const productUpdated = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
    }

    const result = await productModel.updateOne({_id:pid},{$set:productUpdated})

        res.send({
            status: "success",
            message: result
        })

});

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const result = await productModel.deleteOne({_id:pid})

    res.send({
        status: "success",
        message: result
    })
});

export default router