const express = require('express');


const router = express.Router();
const pool = require('../config/database');

// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT CONVERT(reference USING utf8) as reference, name, description, price, stock FROM Product');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT CONVERT(reference USING utf8) as reference, name, description, price, stock FROM Product WHERE reference = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Get all images for a product
router.get('/:id/images', async (req, res) => {
    try {
        const [images] = await pool.query('SELECT * FROM Image WHERE reference = ?', [req.params.id]);
        res.json(images);
    } catch (error) {
        console.error('Error fetching product images:', error);
        res.status(500).json({ error: 'Failed to fetch product images' });
    }
});

// Get all products from a category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT CONVERT(p.reference USING utf8) as reference, p.name, p.description, p.price, p.stock FROM Product p ' +
            'JOIN Product_Category pc ON p.reference = pc.reference ' +
            'WHERE pc.id_category = ?',
            [req.params.categoryId]
        );
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

module.exports = router; 