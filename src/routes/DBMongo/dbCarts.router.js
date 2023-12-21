import {Router} from "express"
import cartsModel from "../../dao/models/carts.model.js"
import productModel from "../../dao/models/products.model.js";

const router = Router();



router.post('/', async (req, res) => {
  try {
    const newCart = await cartsModel.create({});
    console.log('Nuevo carrito creado:', newCart);
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartsModel.findById(req.params.cid).populate('products');
    res.status(200).json(cart.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartsModel.findById(req.params.cid);

    
    const existingProduct = cart.products.find(
      (item) => item.product.toString() === req.params.pid
    );

    if (existingProduct) {
      // Si el producto ya existe, incrementar la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si el producto no existe, agregarlo al carrito
      cart.products.push({
        product: req.params.pid,
        quantity: 1,
      });
    }

    await cart.save();
    res.status(201).json(cart.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router
