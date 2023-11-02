class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    addProduct(product) {
      if (this.isProductValid(product)) {
        product.id = this.productIdCounter++;
        this.products.push(product);
        console.log(`Producto añadido. ID: ${product.id}`);
      }
    }
  
    isProductValid(product) {
      const { title, description, price, thumbnail, code, stock } = product;
      if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
        console.error('Todos los campos son obligatorios');
        return false;
      }
      if (this.products.some((p) => p.code === code)) {
        console.error('Ya existe un producto con el mismo código');
        return false;
      }
      return true;
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find((p) => p.id === id);
      if (product) {
        return product;
      } else {
        console.error('Producto no encontrado');
        return null;
      }
    }
  }
  

  
  const manager = new ProductManager();
  
  const product1 = {
    title: 'Producto 1',
    description: 'Descripcion del producto 1',
    price: 10.99,
    thumbnail: 'imagen1.jpg',
    code: 'P1',
    stock: 100,
  };
  
  const product2 = {
    title: 'Producto 2',
    description: 'Descripcion del producto 2',
    price: 19.99,
    thumbnail: 'imagen2.jpg',
    code: 'P2',
    stock: 50,
  };
  
  manager.addProduct(product1);
  manager.addProduct(product2);
  
  console.log(manager.getProducts());
  console.log(manager.getProductById(1));
  console.log(manager.getProductById(3));

  