import fs from 'fs';
import path from 'path';


const __filename = import.meta.url.substring('file:///'.length);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');

export default class ProductManager {
    constructor(pathFile) {
        this.path = path.join(rootDir, `files`, pathFile)
        this.idCounter = 0;
        console.log(this.path)
    }

    async init() {
        const products = await this.readProductsFromFile();
        if (products.length > 0) {
            this.idCounter = products[products.length - 1].id;
        }
    }

    generateId() {
        return ++this.idCounter;
    }

    async addProduct(product) {
        try {
            await this.init();
            const products = await this.readProductsFromFile();
            if (this.isProductValid(product)) {
                product.id = this.generateId();
                products.push(product);
                await this.writeProductsToFile(products);
                console.log(`Producto añadido. ID: ${product.id}`);
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }

    async getProducts() {
        const allProducts = await this.readProductsFromFile();
        return allProducts;
    }



    async getProductById(id) {
        const products = await this.readProductsFromFile();
        const product = products.find((p) => p.id === id);
        if (!product) {
            console.error('Producto no encontrado');
            return null;
        }
        return product;

    }


    async updateProduct(id, updatedProduct) {
        const products = await this.readProductsFromFile();
        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex == -1) {
            console.error('Producto no encontrado');
        }

        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        await this.writeProductsToFile(products);
        console.log(`Producto actualizado. ID: ${id}`);
    }

    async deleteProduct(id) {
        const products = await this.readProductsFromFile();
        const productIndex = products.findIndex((p) => p.id === id);

        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            await this.writeProductsToFile(products);
            console.log(`Producto eliminado. ID: ${id}`);
        } else {
            console.error('Producto no encontrado');
        }
    }

    isProductValid(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.error('Todos los campos son obligatorios', error );
            return false;
        }
        return true;
    }



    async readProductsFromFile() {
        try {

            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);

        } catch (error) {
            console.error('Error leyendo el archivo json:', error);
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




