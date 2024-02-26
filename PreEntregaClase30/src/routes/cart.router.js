import {Router} from "express"
import { CartsController } from "../controllers/dbCarts.controller.js";

const router = Router();

router.get("/", CartsController.getCarts);
router.get('/:cid', CartsController.getCartById);

router.post('/', CartsController.addCart);
router.post('/:cid/product/:pid', CartsController.addProductById);

router.delete('/:cid/product/:pid', CartsController.deleteProductById);
router.delete("/:cid", CartsController.deleteCart);
router.delete("/:cid/product", CartsController.deleteAllProductsFromCart)

router.put("/:cid", CartsController.updateCart);
router.put('/:cid/product/:pid', CartsController.updateProductQuantity);

// router.post("/cid/purchase", CartsController.purchaseCart)


export default router
