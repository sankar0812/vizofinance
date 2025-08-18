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

    // Check if email already exists in Employee model
    const existing = await prisma.employee.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || phone, 10);

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        address,
        joinedDate: new Date(joinedDate),
        password: hashedPassword,
        role: 'EMPLOYEE',
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

// DELETE /api/employees/:id
router.delete('/:id', auth, authorize('ADMIN'), async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update
router.put('/:id', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id, 10);
    if (isNaN(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const { password, ...updateData } = req.body;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: updateData,
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update employee', error });
  }
});

router.get("/dashboard", auth, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { email: req.user.email },
      include: {
        clients: {
          include: {
            paymentHistory: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const clients = employee.clients || [];
    let totalPaid = 0;
    let totalDue = 0;

    clients.forEach(client => {
      client.paymentHistory.forEach(payment => {
        totalPaid += payment.amountPaid;
        totalDue += payment.remainingBalance;
      });
    });

    res.json({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      assignclient: clients.length,
      totalPaid,
      totalDue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
});

module.exports = router;
