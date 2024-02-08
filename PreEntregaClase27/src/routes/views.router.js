import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js"

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
router.get("/products", privateAccess, ViewsController.privateAccessProducts);

export default router;