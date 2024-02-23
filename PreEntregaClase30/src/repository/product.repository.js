
export class ProductRepository{
    constructor(dao) {
        this.dao = dao
    }

    async addProduct(product) {
        const newProduct = await this.dao.add(product)
        return newProduct
    }

    async getProducts(options = { page: 1, limit: 10, sort: null }) {
        const products = await this.dao.get(options = { page: 1, limit: 10, sort: null })
        return products

    }


    async getProductById(pid) {
        const product = await this.dao.getById(pid)
        return product
    }

    async updateProduct(pid, updatedProduct){
        const updateProduct = await this.dao.update(pid, updatedProduct)
        return updateProduct
    }
    async deleteProduct(pid){
        const deleteProduct = await this.dao.delete(pid)
        return deleteProduct
    }
    

}



export default ProductRepository