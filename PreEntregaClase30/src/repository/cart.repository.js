export class CartRepository {
    constructor(dao){
        this.dao = dao
    }
        
    async createCart() {
        const newCart = await this.dao.add()
        return newCart
    }

    async getCart() {
        const result = await this.dao.get()
        return result
    }

    async getCartById(cid) {
        const cart = await this.dao.getById(cid)
        return cart
    }

    async addProductById(cid, pid, quantity = 1){
        const addToCart = await this.dao.addProductToCartById()
        return addToCart
    }
    async deleteProductById(cid, pid){
        const deleteFromCart = await this.dao.removeProductFromCartById(cid, pid)
        return deleteFromCart
    }

    async updateProductQuantity(cid, pid, quantity){
        const deleteFromCart = await this.dao.updateProductQuantityInCart(cid, pid, quantity)
        return deleteFromCart
    }

    // async saveCart(newCart){
    //     const saveCart = await this.dao.saveCart(newCart)
    //     return saveCart
    //   }

}
