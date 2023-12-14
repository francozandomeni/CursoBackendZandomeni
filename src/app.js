import express from 'express';
import ProductManager from './managers/ProductManager.js';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import fs from 'fs';
import path from 'path';
import viewRouter from "./routes/views.router.js"

//dirname
const __filename = import.meta.url.substring('file:///'.length);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');

//inicializar servidor
const PORT = 8080
const app = express()
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

const io = new Server(httpServer)

//handlebars
app.engine("handlebars", engine({ defaultLayout: 'main', extname: 'handlebars' }))
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "/views"))

//express
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)
app.use("/", viewRouter)

// //ProductManager
const pathPm = "products.json"
const productManager = new ProductManager(pathPm)

// Configuración de Socket.io
io.on('connection', async (socket) => {
    console.log('Usuario conectado. ID:', socket.id);

    try {
        const products = await productManager.getProducts();
        io.to(socket.id).emit('updateProducts', [products]);
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
    }

    socket.on('createProduct', async (Product) => {
        productManager.addProduct(Product);
        
        try {
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', [updatedProducts]);
            console.log('Productos actualizados:', [updatedProducts]);
        } catch (error) {
            console.error('Error al obtener la lista de productos:', error);
        }
    });
    



    // Desconexión del usuario
    socket.on('disconnect', () => {
        console.log('Usuario desconectado. ID:', socket.id);
    });
});
export { io };