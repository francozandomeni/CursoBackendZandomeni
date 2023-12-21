import express from "express"
import mongoose from "mongoose"
import __dirname from "./utils.js"
import { engine } from "express-handlebars"
import productRoutes from "./routes/DBMongo/dbProducts.router.js"
import viewRoutes from "./routes/DBMongo/dbViews.router.js"
import cartRoutes from "./routes/DBMongo/dbCarts.router.js"
import {Server} from "socket.io"
import messageModel from "./dao/models/messages.model.js"

const PORT = 8080
const app = express()

const MONGO = "mongodb+srv://kacozandomeni:Jumzf8owIStzB2bb@cluster0.wtjpkqk.mongodb.net/ecommerce";

const connection = mongoose.connect(MONGO)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", `${__dirname}/views`)


app.use("/", viewRoutes)
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes)

let messages = [];

const io = new Server(httpServer);

io.on("connection", (socket)=>{
    
    socket.on("chat-message", async (data)=>{
        const message = { username: data.username, message: data.message };
         await messageModel.create(message);
        messages.push(data);
        io.emit("messages", messages);
    })

    socket.on("new-user", (username)=>{
        socket.emit("messages", messages);
        socket.broadcast.emit("new-user", username);
    })
})

