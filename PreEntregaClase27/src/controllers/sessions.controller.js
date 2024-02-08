class SessionsController {
    static register = async (req, res) => {
        try {

            if (req.body.email === "franco@coder.com" && req.body.password === "adminCoderfranco123") {
                req.user.role = "admin";
            }


            await req.user.save();

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
        // Devolver la información del usuario autenticado
        res.send({
            status: "success",
            user: {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                email: req.user.email,
                role: req.user.role,
            },
        });
    }
}

export { SessionsController }