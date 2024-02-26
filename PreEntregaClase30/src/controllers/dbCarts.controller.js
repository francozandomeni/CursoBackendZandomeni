import { cartService } from "../repository/index.js";


class CartsController {

    static getCarts = async (req, res) => {
        try {
            const cart = await cartService.getCarts()
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static addCart = async (req, res) => {
        try {
          const newCart = await cartService.createCart();
          res.status(200).json(newCart);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    
    static getCartById = async (req, res) => {
        try {
          const cart = await cartService.getCartById(req.params.cid);
          res.status(200).json(cart.products);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

    static addProductById = async (req, res) => {
        try {
          const { cid, pid } = req.params;
          // const quantity = 1
          const result = await cartService.addProductById(cid, pid);
          res.status(200).json(result);
          
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

    static deleteProductById = async (req, res) => {
        try {
          const { cid, pid } = req.params;
          const result = await cartService.deleteProductById(cid, pid);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

    static deleteCart = async (req, res) => {
      const {cid} = req.params;
    
      try {
        const result = await cartService.deleteCart(cid);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

      static updateProductQuantity = async (req, res) => {
        try {
          const { cid, pid } = req.params;
          const { quantity } = req.body;
          const result = await cartService.updateProductQuantity(cid, pid, quantity);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      static updateCart = async (req, res) => {
        
        const { cid } = req.params;
        const updatedProducts = req.body;
        try {
          const updatedCart = await cartService.updateCart(cid, updatedProducts);
          res.status(200).json(updatedCart);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }

      static deleteAllProductsFromCart = async (req, res) => {
        const { cid } = req.params;
      
        try {
          const result = await cartService.deleteAllFromCart(cid);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }

      
}


export { CartsController };