import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path"


const __filename = import.meta.url.substring('file:///'.length);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');


const pathPm = "products.json"
const productManager = new ProductManager(pathPm)

const router = Router()

router.get('/', (req, res) => {
    res.render('home', { products: productManager.getProducts() });
});

router.get('/realtimeproducts', (req, res) => {
    const viewPath = path.join(__dirname, '../views/layouts/realTimeProducts');
    res.render(viewPath, { products: productManager.getProducts() });
});

export default router