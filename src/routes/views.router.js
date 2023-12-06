import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path"


const __filename = import.meta.url.substring('file:///'.length);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');


const pathPm = "products.json"
const productManager = new ProductManager(pathPm)

const router = Router()

router.get('/', async (req, res) => {
    const allProducts = await productManager.getProducts()
    res.render('home', { products: allProducts });
});

router.get('/realtimeproducts', async (req, res) => {
    const viewPath = path.join(__dirname, '../views/layouts/realTimeProducts');
    const allProducts = await productManager.getProducts()
    res.render(viewPath, { products: allProducts });
});

export default router