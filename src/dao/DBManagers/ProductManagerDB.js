import productModel from "../models/products.model.js";

export default class ProductManager {


    async addProduct(product) {
        const result = await productModel.create(product)
        return {
            status: "success",
            msg: result
        }
    }

//utilizar URLs como http://localhost:8080//products?sort=asc&category=Zapatillas&stock=true
    
    async getProducts(options = { page: 1, limit: 10, sort: null }) {
        try {
            const filters = {};
            if (options.category) {
                filters.category = options.category;
            }
            if (options.stock !== null) {
                filters.stock = options.stock;
            }


            const products = await productModel.paginate(filters, options);

            const { totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = products;

            return {
                status: "success",
                msg: {
                    docs: products.docs,  // La lista de productos
                    totalDocs,
                    limit,
                    page,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    nextPage,
                    prevPage,
                },
            };
        } catch (error) {
            return {
                status: "error",
                msg: error.message,
            };
        }
    }



    async getProductById(pid) {
        const product = await productModel.find({ _id: pid })
        return {
            status: "success",
            msg: product
        }
    }


    async updateProduct(pid, updatedProduct) {
        const result = await productModel.findByIdAndUpdate(pid, updatedProduct, { new: true }).lean();
        return {
            status: "success",
            msg: result,
        };
    }

    async deleteProduct(pid) {
        const result = await productModel.findByIdAndDelete(pid).lean();
        return {
            status: "success",
            msg: result,
        };
    }

    // async insertManyProducts(products) {
    //     try {
    //         const result = await productModel.insertMany(products);
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}