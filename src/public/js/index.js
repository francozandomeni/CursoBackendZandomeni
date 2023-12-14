const socketClient = io();// Conectar con el servidor de WebSocket



function renderProduct(product) {
    const productList = document.getElementById('productList');
    
    // Crea un nuevo elemento para el producto
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <strong>${product.title}</strong>
    <p>Description: ${product.description}</p>
    <p>Precio: $${product.price}</p>
    <p>Thumbnail: <img src="${product.thumbnail}" alt="Thumbnail"></p>
    <p>Code: ${product.code}</p>
    <p>Stock: ${product.stock}</p>
    <p>ID: ${product.id}</p>
    <button class="delete-product" data-product-id="${product.id}">Eliminar</button>
    `;
    
    // Agrega el nuevo elemento a la lista
    productList.appendChild(listItem);
    
    // Limpia los campos del formulario
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productCode').value = '';
}

document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').value;
    const productStock = document.getElementById('productStock').value;
    const productCode = document.getElementById('productCode').value;

    const newProduct = {
        title: productName,
        description: productDescription,
        price: productPrice ,
        thumbnail: productImage ,
        code: productCode ,
        stock: productStock
    };

    // Emitir el evento createProduct al servidor
    socketClient.emit('createProduct', newProduct);
})

socketClient.off('updateProducts');

socketClient.on('updateProducts', async (productsArray) => {
    try {
        const products = await productsArray[0];
        console.log('Productos recibidos:', products);


        productList.innerHTML = '';
        // Lógica para actualizar la vista con los nuevos productos
        products.forEach(product => renderProduct(product));
    } catch (error) {
        console.error('Error al procesar la actualización de productos:', error);
    }
});



