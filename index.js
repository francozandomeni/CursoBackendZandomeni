import ProductManager from "./managers/ProductManager.js"

const productManager = new ProductManager('./files/products.json');

const newProduct = {
    title: 'Producto de prueba',
    description: 'Descripción del producto de prueba',
    price: 9.99,
    thumbnail: 'imagen.jpg',
    code: 'ABC123',
    stock: 10,
};

// productManager.addProduct(newProduct);

// async function devolverProductos() {
//     const allProducts = await productManager.getProducts();
//     console.log(allProducts);
// }

// devolverProductos();

// async function devolverProducto() {
//     const productId = 3; 
//     const product = await productManager.getProductById(productId);
//     console.log('Producto encontrado:', product);

// }

// devolverProducto()

// async function productToUpdate() {

//     const productIdToUpdate = 1; 
//     const updatedProductData = {
//         price: 12.99,
//         stock: 15,
//     };

//     await productManager.updateProduct(productIdToUpdate, updatedProductData);
// }

// productToUpdate()
    


// async function deleteProduct() {

//     const productIdToDelete = 6;

//     await productManager.deleteProduct(productIdToDelete);

// }

// deleteProduct()