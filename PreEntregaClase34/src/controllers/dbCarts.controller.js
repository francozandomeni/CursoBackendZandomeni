import { cartService, productService } from "../repository/index.js";
import { TicketRepository } from "../repository/tickets.repository.js";
// import productModel from "../dao/models/products.model.js";
import { v4 as uuidv4 } from 'uuid';
import userModel from "../dao/models/Users.models.js";
import { GetUserDto } from "../dao/dto/users.dto.js";

function generateCode() {
  return uuidv4();
}

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
    const { cid } = req.params;

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


  static purchase = async (req, res) => {
    try {
      const user = req.params.user
      const cid = req.params.cid;
      console.log("Starting purchase process...");
      console.log("Cart ID is:", cid);
      console.log("Cart purchaser:", user)
      if(!user || !cart){
        console.log("We can't proceeed without information from the user or cart")
      }
     

      const cart = await cartService.getCartById(cid);
      console.log("Cart finded:", cart);

      if (!cart) {
        console.log("Cart doesn't exist");
        return res.status(404).json({ error: "El carrito no existe" });
      }

      // Checking stock for every product in cart
      for (const cartProduct of cart.products) {
        const product = await productService.getProductById(cartProduct.product);
        console.log("'for' from Product:", product); // Check the product
        const quantityInCart = cartProduct.quantity

        console.log("stock in cart/quantity in cart", quantityInCart)



        console.log(`checking stock for product: ${cartProduct._id}...`);

        if (product.stock < quantityInCart) { 
          console.log(`Not enough stock for product: ${cartProduct._id}`);
          // Adjust to no exceed quantity available
          cartProduct.quantity = product.stock;
          // Updating cart in DB
          await cart.save();
          return res.status(400).json({ error: `Not enough stock for product ${cartProduct._id}. Max quantity available is ${cartProduct.stock}` });
        }
      }

      // Update stock and creating ticket
      const ticketProducts = [];
      let totalAmount = 0;

      for (const cartProduct of cart.products) {
        const productDetails = await productService.getProductById(cartProduct.product);
        const product = productDetails.product
        console.log("segundo FOR", product)

        const quantityInCart = cartProduct.quantity;

        console.log(`updating stock for product ${cartProduct._id}...`);

        // updating product stock
        product.stock -= quantityInCart;
        await product.save()

        // ticket product info
        ticketProducts.push({
          product: product._id,
          quantity: quantityInCart
        });

        // Calculating total amount
        totalAmount += parseInt(product.price * quantityInCart);

       
      }
      //testing b4 ticket
      if(totalAmount = 0 || !totalAmount){
        console.log(
          "TEST. You don't have a total amount in cart. Purchase and ticket will not be generated")
      }
      
      //creating ticket
      console.log("Creating buying ticket.");
      const ticketRepository = new TicketRepository()
      
      const newTicket = {
        code: generateCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: user,
        products: cart.products
      };

      

      const ticket = await ticketRepository.createTicket(newTicket)
      console.log("Ticket created:", ticket);

      // Cleaning cart after purchase
      cart.products = [];
      await cart.save();

      console.log("Purchase made successfully");

      return res.status(200).json({ status: "success", message: "Purchase made successfully", ticket: ticket });
    } catch (error) {
      console.error("Error processing purchase:", error);
      return res.status(500).json({ error: "Error processing purchase" });
    }
  }
}


export { CartsController };