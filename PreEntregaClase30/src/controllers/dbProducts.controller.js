import { productService } from "../repository/index.js";


class ProductsController {

    static get = async (req,res) => {
        try {
            const { limit, page, sort, category, price } = req.query;
            const options = {
                limit: parseInt(limit) || 10,
                page: parseInt(page) || 1,
                sort: { price: sort === "asc" ? 1 : -1 },
                lean: true,
            };

            const products = await productService.getProducts(options);

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
    }

    async generatePaginationLink(req, page) {
        const params = new URLSearchParams(req.query);
        params.set('page', page);
        return `${req.baseUrl}?${params.toString()}`;
    }


    static getById = async (req,res) =>  {
        try {
            const product = await productService.getProductById(req.params.pid);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static add = async (req,res) =>  {
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
            const result = await productService.addProduct(product);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    static update = async (req,res) =>  {
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


        try {
            const result = await productService.updateProduct(pid, productUpdated);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }
    static delete = async (req,res) =>  {
        {
            const pid = req.params.pid;
            try {
                const result = await productService.deleteProduct(pid);
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    }


}

export { ProductsController };
