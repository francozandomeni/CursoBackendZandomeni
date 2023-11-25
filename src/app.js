
import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const app = express();
const PORT = 8080;


const productManager = new ProductManager('products.json');

app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});



app.use(express.json());


app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;  
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));  
    } else {
      res.json(products);  
    }  
  } catch (error) {
    console.error('Error al obtener productos:', error);  
    res.status(500).json({ error: error.message });
  }  
});  
 
  
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;  

  try {
      const product = await productManager.getProductById(productId);
      
      if (product) {
          res.json(product);
        } else {
      res.status(404).json({ error: 'Producto no encontrado' });      
    }  
  } catch (error) {
      res.status(500).json({ error: error.message });
    }  
});    


