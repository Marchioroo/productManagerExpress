const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // Método para ler o arquivo e retornar os dados como um array
    async #readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return []; // Retorna array vazio se o arquivo não existir
            throw error;
        }
    }

    // Método para escrever os dados no arquivo
    async #writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    // Método para adicionar um novo produto
    async addProduct(product) {
        const products = await this.#readFile();

        // Gera um ID auto-incrementado
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = { id: newId, ...product };

        // Adiciona o novo produto ao array
        products.push(newProduct);
        await this.#writeFile(products);

        return newProduct;
    }

    // Método para obter todos os produtos
    async getProducts() {
        return await this.#readFile();
    }

    // Método para obter um produto pelo ID
    async getProductById(id) {
        const products = await this.#readFile();
        return products.find(product => product.id === id) || null;
    }

    // Método para atualizar um produto pelo ID
    async updateProduct(id, updatedProduct) {
        const products = await this.#readFile();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) return null; // Retorna null se o produto não for encontrado

        // Atualiza o produto sem alterar o ID
        products[index] = { ...products[index], ...updatedProduct };
        await this.#writeFile(products);

        return products[index];
    }

    // Método para deletar um produto pelo ID
    async deleteProduct(id) {
        const products = await this.#readFile();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) return null; // Retorna null se o produto não for encontrado

        // Remove o produto do array
        const deletedProduct = products.splice(index, 1)[0];
        await this.#writeFile(products);

        return deletedProduct;
    }
}

module.exports = ProductManager;

// Função assíncrona para testar os métodos
async function test() {
    const manager = new ProductManager('./products.json'); // Ajuste no caminho aqui

    // Adiciona um produto
    const newProduct = await manager.addProduct({
        title: 'Produto 1',
        description: 'Descrição do produto',
        price: 100,
        thumbnail: 'imagem.jpg',
        code: '123ABC',
        stock: 10
    });
    console.log('Produto adicionado:', newProduct);

    // Obtém todos os produtos
    const products = await manager.getProducts();
    console.log('Todos os produtos:', products);

    // Obtém um produto pelo ID
    const product = await manager.getProductById(1);
    console.log('Produto com ID 1:', product);

    // Atualiza um produto
    const updatedProduct = await manager.updateProduct(1, { price: 150 });
    console.log('Produto atualizado:', updatedProduct);

    // Deleta um produto
    const deletedProduct = await manager.deleteProduct();
    console.log('Produto deletado:', deletedProduct);
}

// Executa o teste
test().catch(console.error);
