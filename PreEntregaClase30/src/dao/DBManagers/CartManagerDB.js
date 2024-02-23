import cartsModel from "../models/carts.model.js"
// import productModel from "../models/products.model.js"


export default class CartManager {

  async add() {
    const newCart = await cartsModel.create({});
    return newCart;

  }

  // async saveCart(newCart){
  //    const saveCart = await cartsModel.save()
  //    return saveCart
  // }

  async get() {
    const carts = await cartsModel.find()
    return carts
  }

  async getById(cid) {
    const cart = await cartsModel.findById(cid).populate("products");
    return cart;
  }

  async addProductToCartById(cid, pid, quantity = 1) {

    try {
      const cart = await cartsModel.findById(cid)
      if (!cart) {
        return {
          status: "error",
          msg: `El carrito con el ${cid} no existe`,
        };
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      );

      if (existingProductIndex !== -1) {
        // Si el producto ya existe, incrementa la cantidad
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Si el producto no existe, agregar al carrito
        cart.products.push({
          product: pid,
          quantity: quantity,
        });
      }

      await cart.save();
      return {
        status: "success",
        msg: `El producto se ha agregado correctamente`,
        cart: cart.products,
      };


    } catch (error) {
      return {
        status: "error",
        msg: error.message,
      };
    }
  }

  async removeProductFromCartById(cid, pid) {
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return {
        status: "error",
        msg: `El carrito con el ${cid} no existe`,
      };
    }

    const updatedProducts = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    cart.products = updatedProducts;
    await cart.save();

    return {
      status: "success",
      msg: `El producto se ha eliminado correctamente`,
      cart: cart.products,
    };
  } catch (error) {
    return {
      status: "error",
      msg: error.message,
    };
  }
}

  async updateProductQuantityInCart(cid, pid, quantity) {
  try {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return {
        status: "error",
        msg: `El carrito con el ${cid} no existe`,
      };
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (existingProductIndex !== -1) {
      // Si el producto existe, actualiza la cantidad
      cart.products[existingProductIndex].quantity = quantity;
      await cart.save();
      return {
        status: "success",
        msg: `La cantidad del producto se ha actualizado correctamente`,
        cart: cart.products,
      };
    } else {
      return {
        status: "error",
        msg: `El producto con el ${pid} no existe en el carrito`,
      };
    }
  } catch (error) {
    return {
      status: "error",
      msg: error.message,
    };
  }
}


}

