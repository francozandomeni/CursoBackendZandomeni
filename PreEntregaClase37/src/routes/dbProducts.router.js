import { Router } from "express"
import { ProductsController } from "../controllers/dbProducts.controller.js";
import { errorHandler } from "../middleware/errorHandler.js"
import { addLogger } from "../utils/logger.js";
import { checkRole } from "../middleware/auth.js"


const router = Router()

router.get('/', ProductsController.get)

router.get('/:pid', addLogger, ProductsController.getById);

router.post("/", addLogger,checkRole(["admin", "premium"]), ProductsController.add);

router.put('/:pid', addLogger, checkRole(["admin", "premium"]), ProductsController.update);

router.delete('/:pid', checkRole(["admin", "premium"]), ProductsController.delete);

router.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

// router.use(addLogger)

export default router