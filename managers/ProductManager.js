import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ProductManager {
    constructor() {
        this.path = join(__dirname, 'ruta', 'al', 'archivo', 'products.json');
        this.products = [];
        
    }

    async addProduct(product) {
        try {
            const products = await this.readProductsFromFile();
            if (this.isProductValid(product)) {
                product.id = this.#generarId()               
                this.products.push(product);
                await this.writeProductsToFile(this.products);
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
        if (!product) {
            console.error('Producto no encontrado');
            return null;
        } 
        return product
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
    
        if (productIndex == -1) {
            console.error('Producto no encontrado');          
        } 
            const deletedProduct = products.splice(productIndex, 1)[0];
            await this.writeProductsToFile(products);
            console.log(`Producto eliminado. ID: ${id}`);
            console.log('Producto eliminado:', deletedProduct);
    }
    


    isProductValid(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.error('Todos los campos son obligatorios');
            return false;
        }
        return true;
    }



    async readProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const { products, lastId } = JSON.parse(data);
       
            if (products && lastId !== undefined) {
            this.products = products;
            return this.products
        } else {
            console.error("El formato del arcchivo no es valido, Verificar estructura de json")
            return [];
        }

        } catch (error) {
            console.error("Error al leer el archivo de productos:", error)
            return [];
        }
    }

    async writeProductsToFile(products) {
        try {
            const lastId = this.products.length
            ? this.#generarId() - 1
            : 0;
            const dataToWrite = {
                products,
                lastId, 
            };
            await fs.promises.writeFile(this.path, JSON.stringify(dataToWrite, null, 2));
        } catch (error) {
            console.error('Error al escribir en el archivo de productos');
        }
    }

    #generarId() {
        return this.products.length
        ? this.products[this.products.length - 1].id + 1
        : 1;
    }
}


