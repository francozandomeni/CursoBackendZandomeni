import { Router } from "express"
import productManager from "../../dao/DBManagers/ProductManagerDB.js"

const router = Router()

const productManagerMongo = new productManager()

router.get('/', async (req, res) => {
  try {
      const { limit, page, sort, category, price } = req.query;
      const options = {
          limit: parseInt(limit) || 10,
          page: parseInt(page) || 1,
          sort: { price: sort === "asc" ? 1 : -1 },
          lean: true,
      };

      const products = await productManagerMongo.getProducts(options);

      if (products.hasPrevPage) {
          products.prevLink = generatePaginationLink(req, products.prevPage);
      }

      if (products.hasNextPage) {
          products.nextLink = generatePaginationLink(req, products.nextPage);
      }

      res.send({
          status: "success",
          productos: products,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

function generatePaginationLink(req, page) {
  const params = new URLSearchParams(req.query);
  params.set('page', page);
  return `${req.baseUrl}?${params.toString()}`;
}



router.get('/:pid', async (req, res) => {
    try {
        const product = await productManagerMongo.getProductById(req.params.pid);
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;

    if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
        return res.status(400).send({
            status: "error",
            message: "Faltan campos obligatorios"
        })

    }
    const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock

    }

    try {
        const result = await productManagerMongo.addProduct(product);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

//     router.post('/insertMany', async (req, res) => {
//       try {
//           const result = await productManagerMongo.insertManyProducts(productsData);
//           res.status(201).json({
//               status: "success",
//               message: "Productos insertados correctamente",
//               insertedProducts: result,
//           });
//       } catch (error) {
//           res.status(500).json({ message: error.message });
//       }
//   });

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const { title, description, price, thumbnail, code, stock } = req.body;


    const productUpdated = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
    }


    try{
        const result = await productManagerMongo.updateProduct(pid, productUpdated);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }

});

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        const result = await productManagerMongo.deleteProduct(pid);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

export default router