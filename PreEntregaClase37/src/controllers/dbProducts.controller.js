import { productService, userService } from "../repository/index.js";
import { CustomError } from "../services/customError.service.js"
import { generateProductErrorInfo } from "../services/ProductErrorInfo.js"
import { EError } from "../enums/EError.js"
import { generateProductErrorParam } from "../services/ProductErrorParams.js"


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

            if (!product) {
                throw CustomError.createError({
                    name: "Product by ID error",
                    cause: generateProductErrorParam(req.params.pid),
                    message: "Error getting product by ID",
                    errorCode: EError.INVALID_PARAM
                })
            }


            res.status(200).json(product);
        } catch (error) {
            if (error.name === "CastError" && error.kind === "ObjectId") {
                req.logger.warn("Invalid ID format provided");
                res.status(400).json({ message: "Invalid ID format provided" });
            } else if (error.cause) {
                req.logger.warn("The ID info is wrong");
                res.status(400).json({ message: error.message, cause: error.cause });
            } else {
                req.logger.error("Internal error getting product by ID");
                res.status(500).json({ message: error.message });
            }
        }
    };

    static add = async (req, res) => {

        
        try {
            
            const { title, description, price, thumbnail, code, stock, category } = req.body;
            
            if(!req.body){
                res.send(`<div>Error, la info no ha llegado correctamente. <a href="/create-product">Intente de nuevo</a></div>`)
            }
            

            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                throw CustomError.createError({
                    name: "Product create error",
                    cause: generateProductErrorInfo(req.body),
                    message: "Error creando el producto",
                    errorCode: EError.EMPTY_FIELDS
                })



            }
            
            const user = req.user ? req.user._id : "admin"
            
            const owner = await userService.getUserById(user)
            
            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                owner

            }


            const result = await productService.addProduct(product);
            res.send("Se ha creado el producto correctamente.")
            
        } catch (error) {
            if (error.cause) {
                req.logger.warn("error 400 creando el producto")
                res.status(400).json({ message: error.message, cause: error.cause });
            } else {
                req.logger.error("error creando el producto")
                
                res.send(`<div>Error, <a href="/create-product">Intente de nuevo</a></div>`)
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
            
            const checkOwner = await userService.getUserById(info)

            try {
                // if()
                const result = await productService.deleteProduct(pid);
                res.status(200).json(result);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    }


}

export { ProductsController };
