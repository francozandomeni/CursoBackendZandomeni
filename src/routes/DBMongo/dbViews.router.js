import { Router } from "express"
import productManager from "../../dao/DBManagers/ProductManagerDB.js"

const router = Router()

const productManagerMongo = new productManager()

router.get("/", async (req, res) => {
    res.render("home")
})

router.get("/products", async (req, res) => {
    try {
      const { limit, page, sort, category, price, stock } = req.query;
      const options = {
        limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: sort === "asc" ? { price: 1 } : sort === "dsc" ? { price: -1 } : null,
            category: category || null,
            stock: stock !== undefined ? stock === 'true' : null,
            lean: true,
      };
  
      const products = await productManagerMongo.getProducts(options);
      console.log('Productos obtenidos:', products);
  


    res.render("products", {
        productos: products.msg.docs,
        hasPrevPage: products.msg.hasPrevPage,
        hasNextPage: products.msg.hasNextPage,
        prevPage: products.msg.prevPage,
        nextPage: products.msg.nextPage,
      });
      
    } catch (error) {
        console.error("error en la ruta /products:", error)
      res.status(500).json({ message: error.message });
    }
  });

router.get("/chat", async (req, res) => {
    res.render("chat")
})



export default router 