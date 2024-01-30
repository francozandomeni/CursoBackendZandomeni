import { Router } from "express";
import productManager from "../dao/DBManagers/ProductManagerDB.js"


const router = Router();

const productManagerMongo = new productManager()

const publicAccess = (req,res,next) =>{
  if(req.session.user){
      return res.redirect('/');
  }
  next();
}
const privateAccess = (req,res,next) =>{
  if(!req.session.user){
      return res.redirect('/login');
  }
  next();
}
router.get('/register', publicAccess, (req,res)=>{
  res.render('register')
});
router.get('/login', publicAccess, (req,res)=>{
  res.render('login')
})
router.get('/',privateAccess, (req,res)=>{

  res.render('products', {user:req.session.user})
})

router.get("/resetPassword", (req,res)=>{
  res.render("resetPassword");
})

router.get("/products", privateAccess , async (req, res) => {
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
    



  res.render("products",{
      productos: products.msg.docs,
      hasPrevPage: products.msg.hasPrevPage,
      hasNextPage: products.msg.hasNextPage,
      prevPage: products.msg.prevPage,
      nextPage: products.msg.nextPage,
      user:req.session.user
    });

  } catch (error) {
      console.error("error en la ruta /products:", error)
    res.status(500).json({ message: error.message });
  }
});

export default router;