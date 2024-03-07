import { Router } from "express"
import {addLogger} from "../utils/logger.js"

const router = Router()

router.use(addLogger)

router.get("/", (req,res)=> {
    res.send("Bienvenido")
})

export default router