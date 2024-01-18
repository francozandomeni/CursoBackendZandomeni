import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/register",passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
async (req,res) => {
    res.send({status:"success", message:"User registrado"})
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
    req.session.user ={
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age:req.user.age,
        email:req.user.email
    }
    res.send({status:"success", payload:req.user})
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

// router.post("/restartPassword", async (req,res)=>{
//     const {email,password} = req.body;
//     if(!email || !password) return res.status(400).send(
//         res.send({
//             status:"error",
//             message:"Datos incorrectos"
//         })
//     )
//     const user = await userModel.findOne({email});
//     if(!user) return res.status(400).send(
//         res.send({
//             status:"error",
//             message:"No existe el usuario"
//         })
//     )
//     const newHashPassword = createHash(password);

//     await userModel.updateOne({_id:user._id},{$set:{password:newHashPassword}});
//     res.send({
//         status:"success",
//         message:"contraseña restaurada"
//     })
// })

export default router;