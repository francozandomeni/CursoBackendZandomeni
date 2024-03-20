import { Router } from "express";
import passport from "passport";
import {SessionsController} from "../controllers/sessions.controller.js"
import {checkRole} from "../middleware/auth.js"

const router = Router();

router.post("/register",passport.authenticate("register", {failureRedirect:"/api/sessions/failregister"}),
SessionsController.register
)

router.get("/failregister", SessionsController.failRegister)

router.post("/login", passport.authenticate("login", {failureRedirect:'/api/sessions/faillogin'}),
SessionsController.login)

router.get("/faillogin", SessionsController.failLogin)

router.get('/logout', SessionsController.logout)

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}),SessionsController.gitHubCallback);


const isAuthenticated = (req, res, next) => {
    
    if (req.isAuthenticated()) {
      return next();
    }
    
    res.status(400).send({
      status: "error",
      error: "No autenticado",
    });
  };
  
  router.get("/current", isAuthenticated, SessionsController.currentUser);

  router.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

router.post("/forgot-password", SessionsController.forgotPassword)

router.post("/reset-password", SessionsController.resetPassword)

router.put("/premium/:uid", checkRole(["admin"]) , SessionsController.changeRol);


export default router;