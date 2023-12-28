import {Router} from "express"
import cartsModel from "../../dao/models/carts.model.js";
import cartManager from "../../dao/DBManagers/CartManagerDB.js"

const router = Router();

const cartManagerMongo = new cartManager()

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManagerMongo.addCart();
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManagerMongo.getCartById(req.params.cid);
    res.status(200).json(cart.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartManagerMongo.addProductToCartById(cid, pid);
    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartManagerMongo.removeProductFromCartById(cid, pid);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartManagerMongo.updateProductQuantityInCart(cid, pid, quantity);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router
