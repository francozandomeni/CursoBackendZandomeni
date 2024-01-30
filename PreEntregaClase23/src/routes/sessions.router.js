import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/register",passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
async (req,res) => {
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
})

router.get("/failregister", async (req,res)=>{
    console.log('Fallo el registro');
    res.send({error: 'fallo en el registro'})
})

router.post("/login", passport.authenticate("login", {failureRedirect:'/api/sessions/faillogin'}),
async (req,res) =>{ 
    if(!req.user){
        return res.status(400).send({status:"error"})
    }

    if (req.user.email === "franco@coder.com" && req.user.password === "adminCoderfranco123") {
        req.user.role = "admin";
    }


    req.session.user ={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age:req.user.age,
        email:req.user.email,
        role: req.user.role
    }
    res.send({
        status:"success", 
        payload:req.session.user
    })
})

router.get("/faillogin", (req,res)=>{
    res.send({error:"fail login"})
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.status(500).send({
                status: 'error',
                error: 'No se pudo desloguear'
            })
        }
        res.redirect('/login')
    })
})

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect("/")
});


const isAuthenticated = (req, res, next) => {
    
    if (req.isAuthenticated()) {
      return next();
    }
    
    res.status(400).send({
      status: "error",
      error: "No autenticado",
    });
  };
  
  router.get("/current", isAuthenticated, (req, res) => {
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
  });

export default router;