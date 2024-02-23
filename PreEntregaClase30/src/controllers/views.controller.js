import { productService } from "../repository/index.js"

class ViewsController {
    static register = (req,res)=>{
        res.render('register')
      }

    static login = (req,res)=>{
        res.render('login')
      }

    static products = (req,res)=>{
         res.render('products', {user:req.session.user})
      }

    static privateAccessProducts = async (req, res) => {
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
      
          const products = await productService.getProducts(options);
          
      
      
      
        res.render("products",{
            productos: products.msg.docs,
            hasPrevPage: products.msg.hasPrevPage,
            hasNextPage: products.msg.hasNextPage,
            prevPage: products.msg.prevPage,
            nextPage: products.msg.nextPage,
            user:req.session.user
            
          });
          // console.log(user)
        } catch (error) {
            console.error("error en la ruta /products:", error)
          res.status(500).json({ message: error.message });
        }
      }

      static chat = async (req, res) => {
        res.render("chat")
      }
}

export {ViewsController}
