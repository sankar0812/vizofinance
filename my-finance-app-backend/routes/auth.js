const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return res.status(400).json({ message: 'Invalid Email Address.' });

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Password.' });
 
    const token = jwt.sign({ id: client.id, role: client.role }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    res.json({
      message: 'Logged in successfully!',
      name: client.name,
      role: client.role,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// REGISTER new client
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address, joinedDate } = req.body;

  try {
    // Check if client already exists
    const existingClient = await prisma.client.findUnique({ where: { email } });
    if (existingClient) {
      return res.status(400).json({ message: 'Client with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create client (with role USER by default)
    const client = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        joinedDate: joinedDate || new Date().toISOString(),
        role: 'USER',
      },
    });

    res.status(201).json({
      message: 'Client registered successfully!',
      clientId: client.id,
    });
  } catch (error) {
    console.error('Error during client registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

module.exports = router;