import nodemailer from "nodemailer"
import { options } from "./config.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";


const adminEmail = options.gmail.adminAccount
const adminPass = options.gmail.adminPass

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

export const sendRecoveryPass = async (userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`
    await transporter.sendMail({
        from: options.gmail.adminEmail,
        to: userEmail,
        subject: "Restablecimiento de contraseña",
        html: `
        <div>
            <h2>Has solicitado un cambio de contraseña</h2>
            <p>Haz click en el siguiente enlace para restablecer la contraseña</p>
            <a href="${link}">
                <button>Restablecer contraseña</button>
            </a>
            <h1>Por favor, siempre chequea que el origen de estos emails sea del dueño y/o creador de la pagina que tratas de cambiar la contraseña. Ademas, ten en cuenta que nunca te pediremos informacion sensible a traves de email u otro entorno que no sea el de la plataforma oficial. Ten precaucion.</h1>
        </div>`
    })


}

export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
};

export const generateEmailToken = (email,expireTime)=>{
    const token = jwt.sign({email},adminPass,{expiresIn:expireTime}); 
    return token;
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token,adminPass);
        console.log(info);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};