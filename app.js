import express from 'express';
import ProductManager from './src/managers/ProductManager.js';
import { productsRouter } from './src/routes/products.router.js';
// import { cartsRouter } from './routes/carts.router.js';


const PORT = 8080
const app = express()

const productManager = new ProductManager("products.json")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/products", productsRouter);
// app.use("/api/carts", cartsRouter)

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});