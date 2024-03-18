import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js"
import { checkRole } from "../middleware/auth.js"

const router = Router();

const publicAccess = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
}
const privateAccess = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}
router.get('/register', publicAccess, ViewsController.register);
router.get('/login', publicAccess, ViewsController.login)
router.get('/', privateAccess, ViewsController.products)
router.get("/productos", privateAccess, ViewsController.privateAccessProducts);
router.get("/chat", privateAccess, ViewsController.chat)
router.get("/forgot-password", ViewsController.forgotPassword)
router.get("/reset-password", ViewsController.resetPassword)
router.get("/create",checkRole(["admin", "premium"]) ,ViewsController.createProducts)

export default router;