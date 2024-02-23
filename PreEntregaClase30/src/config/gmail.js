import nodemailer from "nodemailer"
import { options } from "./config.js"

const adminEmail = options.gmail.adminAccount
const adminPass = options.gmail.adminPass

// console.log(adminEmail)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPass
    },
    secure: false,
    tls: { rejectUnauthorized: false }
})

export { transporter }