import { Router } from "express"
import ProductManager from "../managers/ProductManager.js"
import { io } from "../app.js"

const path = "products.json"
const productManager = new ProductManager(path)

const router = Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);

        const products = await productManager.getProducts()

        const limitedProducts = limit ? products.slice(0, limit) : products;

        if (!limitedProducts.length) {
            res.status(200).json({ message: "No products found" })
        } else {
            res.status(200).json({ message: "Products found", products: limitedProducts })

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
            res.status(400).json({ message: "El producto con ese id no existe" });
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

            io.emit('newProduct', newProduct);

            res.status(200).json({ message: 'Producto añadido correctamente', product: newProduct });
        } else {
            res.status(400).json({ error: 'Producto no válido' });
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;

    try {
        await productManager.init();

        // Verifica si el producto existe
        const getProduct = await productManager.getProductById(productId);
        if (!getProduct) {
            return res.status(400).json({ error: 'Producto no encontrado' });
        }

        // Actualiza el producto sin cambiar el ID
        const updatedFields = { ...getProduct, ...updatedProduct };
        await productManager.updateProduct(productId, updatedFields);

        return res.status(200).json({ message: 'Producto actualizado correctamente', updatedFields });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        await productManager.init();

        // Verifica si el producto existe
        const getProduct = await productManager.getProductById(productId);
        if (!getProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Elimina el producto
        await productManager.deleteProduct(productId);

        io.emit('productDeleted', productId);

        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export { router as productsRouter }