import { productService } from "../repository/index.js";
import {CustomError} from "../services/customError.service.js"
import {generateProductErrorInfo} from "../services/ProductErrorinfo.js"
import {EError} from "../enums/EError.js"

class ProductsController {

    static get = async (req, res) => {
        try {
            const { limit, page, sort, category, price } = req.query;
            const options = {
                limit: parseInt(limit) || 10,
                page: parseInt(page) || 1,
                sort: { price: sort === "asc" ? 1 : -1 },
                price: parseFloat(price),
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


    static getById = async (req, res) => {
        try {
            const product = await productService.getProductById(req.params.pid);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

        static add = async (req, res, next) => {
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            let responseSent = false;
    
            try {
                if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                    throw CustomError.createError({
                        name: "Product create error",
                        cause: generateProductErrorInfo(req.body),
                        message: "Error creando el producto",
                        errorCode: EError.EMPTY_FIELDS
                    });
                }
    
                const product = {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                };
    
                const result = await productService.addProduct(product);
                if (!responseSent) {
                    responseSent = true;
                    return res.status(200).json(result);
                }
            } catch (error) {
                if (!responseSent) {
                    next(error); // Pass the error to the next middleware for error handling
                }
            }
        };
    
    




    static update = async (req, res) => {
        const pid = req.params.pid;
        const { title, description, price, thumbnail, code, stock, category } = req.body;


        const productUpdated = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        }


        try {
            const result = await productService.updateProduct(pid, productUpdated);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }
    static delete = async (req, res) => {
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
