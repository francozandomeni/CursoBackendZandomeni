import express from 'express';
import ProductManager from '../managers/ProductManager.js';


const PORT = 8080
const app = express()

const productManager = new ProductManager("./files/products.json")

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/products", async (req, res) => {
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

app.get('/products/:id', async (req, res) => {
    
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