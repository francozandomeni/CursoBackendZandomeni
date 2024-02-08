import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import __dirname from "./utils.js"
import { engine } from "express-handlebars"
import viewRoutes from "./routes/views.router.js"
import sessionRouter from "./routes/sessions.router.js"
import DbProductsRouter from "./routes/dbProducts.router.js"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import { options } from "./config/config.js"



const PORT = options.server.port

const MONGO = options.mongo.url

const app = express()


const connection = mongoose.connect(MONGO)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl:3600
    }),
    secret:"CoderSecret",
    resave:false,
    saveUninitialized:false
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", `${__dirname}/views`)

app.use("/", viewRoutes)
app.use("/api/sessions", sessionRouter)
app.use("/productos", DbProductsRouter )


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

