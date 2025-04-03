const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT CONVERT(id_order USING utf8) as id_order, date_, delivery_address, prixtotal, status, CONVERT(id_user USING utf8) as id_user FROM Order_ WHERE id_order = ?', [req.params.id]);
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(orders[0]);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT CONVERT(id_order USING utf8) as id_order, date_, delivery_address, prixtotal, status, CONVERT(id_user USING utf8) as id_user FROM Order_ WHERE id_user = ?', [req.params.userId]);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
});

// Create new order
router.post('/', async (req, res) => {
    const { delivery_address, prixtotal, id_user, products } = req.body;
    try {
        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create order
            const [orderResult] = await connection.query(
                'INSERT INTO Order_ (id_order, date_, delivery_address, prixtotal, status, id_user) VALUES (CONVERT(UUID() USING utf8), NOW(), ?, ?, 0, ?)',
                [delivery_address, prixtotal, id_user]
            );

            const orderId = orderResult.insertId;

            // Add order products
            for (const product of products) {
                await connection.query(
                    'INSERT INTO Order_Product (id_order, reference, quantity) VALUES (?, ?, ?)',
                    [orderId, product.reference, product.quantity]
                );
            }

            await connection.commit();
            res.status(201).json({ message: 'Order created successfully', orderId: orderId });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order
router.put('/:id', async (req, res) => {
    const { delivery_address, prixtotal, products } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Update order details
            await connection.query(
                'UPDATE Order_ SET delivery_address = ?, prixtotal = ? WHERE CONVERT(id_order USING utf8) = ?',
                [delivery_address, prixtotal, req.params.id]
            );

            // Update order products
            await connection.query('DELETE FROM Order_Product WHERE CONVERT(id_order USING utf8) = ?', [req.params.id]);
            for (const product of products) {
                await connection.query(
                    'INSERT INTO Order_Product (id_order, reference, quantity) VALUES (?, ?, ?)',
                    [req.params.id, product.reference, product.quantity]
                );
            }

            await connection.commit();
            res.json({ message: 'Order updated successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Update order state
router.patch('/:id/state', async (req, res) => {
    const { status } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE Order_ SET status = ? WHERE CONVERT(id_order USING utf8) = ?',
            [status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order state updated successfully' });
    } catch (error) {
        console.error('Error updating order state:', error);
        res.status(500).json({ error: 'Failed to update order state' });
    }
});

module.exports = router; 