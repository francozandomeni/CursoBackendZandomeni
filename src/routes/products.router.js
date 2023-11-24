import { Router } from "express"
import ProductManager from "../managers/ProductManager.js"

const path = "products.json"
const router = Router();
const productManager = new ProductManager(path)

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const products = await productManager.getProducts(limit)

        if (!products.length) {
            res.status(200).json({ message: "No products found" })
        } else {
            res.status(200).json({ message: "Products found", products })

        }
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
})

router.get('/:id', async (req, res) => {

    const { id } = req.params;
    try {

        const productId = parseInt(id);
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).json({ message: "El producto con ese id no existe" });
        } else {
            res.status(200).json({ message: "Producto encontrado", product });
        }
    } catch (error) {
        console.error('Error procesando la peticion:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post('/', async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.init();

        if (productManager.isProductValid(newProduct)) {
            newProduct.id = productManager.generateId();
            await productManager.addProduct(newProduct);

            res.status(200).json({ message: 'Producto añadido correctamente', product: newProduct });
        } else {
            res.status(400).json({ error: 'Producto no válido' });
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export { router as productsRouter }