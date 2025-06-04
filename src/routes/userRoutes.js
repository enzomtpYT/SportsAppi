const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all users
router.get('/', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT CONVERT(id_user USING utf8) as id_user, name, surname, address, zip, city, password, login FROM User_');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT CONVERT(id_user USING utf8) as id_user, name, surname, address, zip, city, password, login FROM User_ WHERE id_user = ?', [req.params.id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create new user
router.post('/', async (req, res) => {
    const { name, surname, address, zip, city, password, login } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO User_ (id_user, name, surname, address, zip, city, password, login) VALUES (CONVERT(UUID() USING utf8), ?, ?, ?, ?, ?, ?, ?)',
            [name, surname, address, zip, city, password, login]
        );
        res.status(201).json({ message: 'User created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    const { name, surname, address, zip, city, password, login } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE User_ SET name = ?, surname = ?, address = ?, zip = ?, city = ?, password = ?, login = ? WHERE CONVERT(id_user USING utf8) = ?',
            [name, surname, address, zip, city, password, login, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM User_ WHERE CONVERT(id_user USING utf8) = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Get user by login - only returns ID, username and password
router.get('/login/:login', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT CONVERT(id_user USING utf8) as id_user, login, password FROM User_ WHERE login = ?', [req.params.login]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user by login:', error);
        res.status(500).json({ error: 'Failed to fetch user by login' });
    }
});

module.exports = router; 