import { Router } from "express"
import { ProductsController } from "../controllers/dbProducts.controller.js";
import {errorHandler } from "../middleware/errorHandler.js"
import { addLogger } from "../utils/logger.js";

const router = Router()

router.get('/', ProductsController.get)
router.get('/:pid',addLogger, ProductsController.getById);
router.post('/' , addLogger ,ProductsController.add);
router.put('/:pid', ProductsController.update);
router.delete('/:pid',  ProductsController.delete);

router.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

// router.use(addLogger)

export default router