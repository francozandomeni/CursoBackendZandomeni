import express from 'express';
import ProductManager from './src/managers/ProductManager.js';
import { productsRouter } from './src/routes/products.router.js';
import { cartsRouter } from './src/routes/carts.router.js';
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import fs from 'fs';
import path from 'path';
import viewRouter from "./src/routes/views.router.js"

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
app.set("views", path.join(__dirname, "/src/views"))

//express
app.use(express.static(path.join(__dirname, '/src/public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)
app.use("/", viewRouter)

//ProductManager
const pathPm = "products.json"
const productManager = new ProductManager(pathPm)

// Configuración de Socket.io
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Emitir la lista de productos a la vista de tiempo real
    io.to(socket.id).emit('updateProducts', productManager.getProducts());

    // Manejar la creación de nuevos productos
    socket.on('createProduct', (newProduct) => {
        productManager.addProduct(newProduct);
        // Emitir la actualización de productos a todos los clientes
        io.emit('updateProducts', productManager.getProducts());
    });

    // Manejar la eliminación de productos
    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId);
        // Emitir la actualización de productos a todos los clientes
        io.emit('updateProducts', productManager.getProducts());
    });

    // Desconexión del usuario
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});
export { io };