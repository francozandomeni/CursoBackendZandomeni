import { Router } from "express"
import CartManager from "../managers/CartManager.js";

const path = "carts.json"
const router = Router();
const cartManager = new CartManager(path)

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
      const newCart = {
        products: [],
      };
  
      await cartManager.addCart(newCart);
  
      res.status(200).json({ message: 'Carrito creado correctamente', cart: newCart });
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Obtener un carrito por ID
  router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const cart = await cartManager.getCartById(cartId);
  
      if (!cart) {
        return res.status(400).json({ error: 'Carrito no encontrado' });
      }
  
      res.status(200).json({ cart });
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Agregar un producto al carrito por su ID
  router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
  
    try {
      const result = await cartManager.addProductToCartById(cartId, productId);
  
      res.status(200).json({ message: result });
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });


export { router as cartsRouter }