const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const PORT = 8080; // Porta do servidor
const productManager = new ProductManager('./products.json');

app.use(express.json()); // Middleware para ler JSON

// Endpoint para obter todos os produtos com suporte a ?limit=
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();
        
        // Retorna todos os produtos ou limita o número de produtos
        if (limit && limit > 0) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }
});

// Endpoint para obter um produto pelo ID
app.get('/products/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productManager.getProductById(pid);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Produto não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter o produto.' });
    }
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
