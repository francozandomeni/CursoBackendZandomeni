import { GetUserDto } from "../dao/dto/users.dto.js";
import {CustomError} from "../services/customError.service.js"
import {generateUserErrorInfo} from "../services/UserErrorInfo.js"
import {EError} from "../enums/EError.js"

class SessionsController {
    static register = async (req, res) => {
        try {
            

            if (req.body.email === "franco@coder.com" && req.body.password === "adminCoderfranco123") {
                req.user.role = "admin";
            }

            const { first_name, last_name, email } = req.body;
        

            if (!first_name || !last_name || !email) {
                throw CustomError.createError({
                      name:"User create error",
                      cause: generateUserErrorInfo(req.body),
                      message:"Error creando el usuario",
                      errorCode: EError.EMPTY_FIELDS
                 })
                }
            

            await req.user.save();
            console.log("sessions controller register", req.session.user)
            res.send({
                status: "success",
                message: "Usuario registrado exitosamente"
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: "error",
                error: "Error en el registro"
            });
        }
    }

    static failRegister = async (req, res) => {
        console.log('Fallo el registro');
        res.send({ error: 'fallo en el registro' })
    }

    static login = async (req, res) => {
        if (!req.user) {
            return res.status(400).send({ status: "error" })
        }

        if (req.user.email === "franco@coder.com" && req.user.password === "adminCoderfranco123") {
            req.user.role = "admin";
        }


        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
        }
        console.log("sessions login controller", req.session.user)
        res.send({
            status: "success",
            payload: req.session.user
        })
    }

    static failLogin = (req, res) => {
        res.send({ error: "fail login" })
    }

    static logout = (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    error: 'No se pudo desloguear'
                })
            }
            res.redirect('/login')
        })
    }

    static gitHubCallback = async (req, res) => {
        req.session.user = req.user;
        res.redirect("/")
    }

    static currentUser = (req, res) => {
        try {
            if (req.session && req.session.user) {
              const userDTO = new GetUserDto(req.session.user);
              res.status(200).json({
                status: "success",
                user: userDTO
              });
            } else {
              res.status(401).json({
                status: "error",
                message: "No hay sesión de usuario activa"
              });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({
              status: "error",
              message: "Error al obtener el usuario actual"
            })
          }
        }
    }


export { SessionsController }