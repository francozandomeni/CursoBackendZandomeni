import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import __dirname from "./utils.js"
import { engine } from "express-handlebars"
import viewRoutes from "./routes/views.router.js"
import sessionRouter from "./routes/sessions.router.js"
import passport from "passport"
import initializePassport from "./config/passport.config.js"

const MONGO = "mongodb+srv://kacozandomeni:Jumzf8owIStzB2bb@cluster0.wtjpkqk.mongodb.net/ecommerce";

const PORT = 8080
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


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})

//Client ID: Iv1.e8ccfbc76ce39116

//client secret: a6f91eaa9f22b6a479f9680bbdb473b05e7b8dcc

//callback url: http://localhost:8080/api/sessions/githubcallback