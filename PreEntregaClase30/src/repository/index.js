import { CartRepository } from "./cart.repository.js";
import CartManager from "../dao/DBManagers/CartManagerDB.js"
import ProductManager from "../dao/DBManagers/ProductManagerDB.js"
import {ProductRepository} from "./product.repository.js";
import UserManager from "../dao/DBManagers/UserManager.js";
import {UserRepository} from "./user.repository.js"
import { connectDB } from "../config/dbConnection.js";


connectDB()

const cartDao = new CartManager()
const productsDao = new ProductManager()
const usersDao = new UserManager()

export const cartService = new CartRepository(cartDao)
export const productService = new ProductRepository(productsDao)
export const userService = new UserRepository(usersDao)

