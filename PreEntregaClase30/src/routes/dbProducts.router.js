import { Router } from "express"
import { ProductsController } from "../controllers/dbProducts.controller.js";

const router = Router()

router.get('/', ProductsController.get)
router.get('/:pid', ProductsController.getById);
router.post('/', ProductsController.add);
router.put('/:pid', ProductsController.update);
router.delete('/:pid',  ProductsController.delete);

export default router