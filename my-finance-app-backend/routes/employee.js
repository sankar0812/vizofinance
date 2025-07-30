// routes/employee.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { auth, authorize } = require('../middleware/auth');

// POST /api/employees
router.post('/', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, email, phone, address, joinedDate, password } = req.body;


    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || phone, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'EMPLOYEE',
      },
    });

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        address,
        joinedDate: new Date(joinedDate),
        role: 'EMPLOYEE',
        userId: newUser.id,
      },
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/employees
router.get('/', auth, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});

// GET /api/employees/:id
router.delete('/:id', auth, authorize('ADMIN'), async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Find the employee to get the associated userId
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Step 2: Delete the employee
    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    // Step 3: Delete the user using userId
    await prisma.user.delete({
      where: { id: employee.userId },
    });

    res.status(200).json({ message: 'Employee and user deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /api/employees/:id
router.put('/:id', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id, 10);
    if (isNaN(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: req.body,
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update employee', error });
  }
});

module.exports = router;
