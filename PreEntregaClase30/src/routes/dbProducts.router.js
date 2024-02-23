import { Router } from "express"
import { ProductsController } from "../controllers/dbProducts.controller.js";
import ProductManager from "../dao/DBManagers/ProductManagerDB.js";

const productManager = new ProductManager()


const router = Router()

router.get('/', ProductsController.get)
router.get('/:pid', ProductsController.getById);
// router.post('/', ProductsController.add);

router.post('/api/products', async (req, res) => {
    try {
        const productsToAdd = req.body;
        const result = await productManager.insertManyProducts(productsToAdd);
        res.json({ message: 'Productos agregados correctamente', result });
    } catch (error) {
        console.error('Error al agregar productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.put('/:pid', ProductsController.update);
router.delete('/:pid',  ProductsController.delete);

export default router