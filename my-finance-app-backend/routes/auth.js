const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });
};

// =======================================
// UNIFIED LOGIN: Detects Role by Email
// =======================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required.' });

  try {
    // 1. Check Admin
    const admin = await prisma.admin?.findUnique({ where: { email } });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

      const token = generateToken(admin);
      return res.json({
        message: 'Admin login successful',
        name: admin.name,
        email: admin.email,
        role: admin.role?.toUpperCase(),
        avatar: admin.avatar || null,
        token,
      });
    }

    // 2. Check Employee
    const employee = await prisma.employee?.findUnique({ where: { email } });
    if (employee) {
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

      const token = generateToken(employee);
      return res.json({
        message: 'Employee login successful',
        name: employee.name,
        email: employee.email,
        role: employee.role?.toUpperCase(),
        avatar: employee.avatar || null,
        token,
      });
    }

    // 3. Check Client
    const client = await prisma.client?.findUnique({ where: { email } });
    if (client) {
      const isMatch = await bcrypt.compare(password, client.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

      const token = generateToken(client);
      return res.json({
        message: 'Client login successful',
        name: client.name,
        email: client.email,
        role: client.role?.toUpperCase(),
        avatar: client.avatar || null,
        token,
      });
    }

    return res.status(404).json({ message: 'User not found with this email' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ========================
// CLIENT REGISTRATION
// ========================
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address, joinedDate } = req.body;

  try {
    const existing = await prisma.client.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || phone, 10);

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
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

module.exports = router;