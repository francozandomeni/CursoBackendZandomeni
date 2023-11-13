import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        try {
            const products = await this.readProductsFromFile();
            if (this.isProductValid(product)) {
                product.id = this.generateId(products);
                products.push(product);
                await this.writeProductsToFile(products);
                console.log(`Producto añadido. ID: ${product.id}`);
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }

    async getProducts() {
        return this.readProductsFromFile();
    }

    async getProductById(id) {
        const products = await this.readProductsFromFile();
        const product = products.find((p) => p.id === id);
        if (product) {
            return product;
        } else {
            console.error('Producto no encontrado');
            return null;
        }
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.readProductsFromFile();
        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updatedProduct };
            await this.writeProductsToFile(products);
            console.log(`Producto actualizado. ID: ${id}`);
        } else {
            console.error('Producto no encontrado');
        }
    }

    async deleteProduct(id) {
        const products = await this.readProductsFromFile();
        const updatedProducts = products.filter((p) => p.id !== id);
        if (products.length > updatedProducts.length) {
            await this.writeProductsToFile(updatedProducts);
            console.log(`Producto eliminado. ID: ${id}`);
        } else {
            console.error('Producto no encontrado');
        }
    }

    isProductValid(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.error('Todos los campos son obligatorios');
            return false;
        }
        return true;
    }

     generateId(products) {
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }

    async readProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeProductsToFile(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error('Error al escribir en el archivo de productos');
        }
    }
}
