const express = require('express');


const router = express.Router();
const pool = require('../config/database');

// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT CONVERT(reference USING utf8) as reference, name, description, price FROM Product');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT CONVERT(reference USING utf8) as reference, name, description, price FROM Product WHERE reference = ?', [req.params.id]);
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
            'SELECT CONVERT(p.reference USING utf8) as reference, p.name, p.description, p.price, p. FROM Product p ' +
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

// Create a new product
router.post('/', async (req, res) => {
    try {
        const { reference, name, description, price } = req.body;
        
        // Validate required fields
        if (!reference || !name || !price) {
            return res.status(400).json({ error: 'Reference, name and price are required' });
        }

        // Insert the product
        await pool.query(
            'INSERT INTO Product (reference, name, description, price) VALUES (?, ?, ?, ?)',
            [reference, name, description, price || 0]
        );

        res.status(201).json({ message: 'Product created successfully', reference });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        
        // Check if product exists
        const [existingProduct] = await pool.query('SELECT * FROM Product WHERE reference = ?', [req.params.id]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product
        await pool.query(
            'UPDATE Product SET name = ?, description = ?, price = ? WHERE reference = ?',
            [name, description, price, req.params.id]
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        // Check if product exists
        const [existingProduct] = await pool.query('SELECT * FROM Product WHERE reference = ?', [req.params.id]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete associated records first (due to foreign key constraints)
        await pool.query('DELETE FROM Product_Category WHERE reference = ?', [req.params.id]);
        await pool.query('DELETE FROM Image WHERE reference = ?', [req.params.id]);
        await pool.query('DELETE FROM Order_Product WHERE reference = ?', [req.params.id]);
        
        // Finally delete the product
        await pool.query('DELETE FROM Product WHERE reference = ?', [req.params.id]);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router; 
