const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { auth, authorize } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Helper function for loan calculations
const calculateLoanPaymentDetails = (principal, annualInterestRate, loanTermMonths) => {
  if (principal <= 0 || loanTermMonths <= 0 || annualInterestRate < 0) {
    return { monthlyPayment: 0, interestPortion: 0, principalPortion: 0 };
  }

  const monthlyInterestRate = (annualInterestRate / 100) / 12;
  let monthlyPayment;

  if (monthlyInterestRate === 0) {
    monthlyPayment = principal / loanTermMonths;
  } else {
    monthlyPayment =
      (principal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
  }

  const interestPortion = principal * monthlyInterestRate;
  const principalPortion = monthlyPayment - interestPortion;

  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    interestPortion: parseFloat(interestPortion.toFixed(2)),
    principalPortion: parseFloat(principalPortion.toFixed(2)),
  };
};

// GET all clients
router.get('/', auth, authorize('ADMIN', 'EMPLOYEE'),async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: { paymentHistory: true },
      orderBy: { id: 'asc' },
    });
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ message: 'Server error fetching clients.' });
  }
});

// GET a single client by ID
router.get('/:id', auth, async (req, res) => {
  const clientId = parseInt(req.params.id);

  // If USER, make sure they can only access their own client profile
  if (req.user.role === 'USER') {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user?.clientId || user.clientId !== clientId) {
      return res.status(403).json({ message: 'You can only access your own data.' });
    }
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { paymentHistory: true },
  });

  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json(client);
});


// CREATE a new client
router.post('/', auth, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const {
      name, email, phone, address, joinedDate, status,
      revenue, transactions, loanAmount, interestRate, loanTermMonths,
      password, role // Accept role from request
    } = req.body;
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Validate and restrict role creation
    let finalRole = 'USER'; // Default fallback
    const currentUserRole = req.user.role;

    if (currentUserRole === 'ADMIN') {
      // Allow ADMIN to assign any role
      if (['USER', 'EMPLOYEE', 'ADMIN'].includes(role)) {
        finalRole = role;
      }
    } else if (currentUserRole === 'EMPLOYEE') {
      // EMPLOYEE can only assign USER role
      if (role === 'USER') {
        finalRole = 'USER';
      } else {
        return res.status(403).json({ message: 'EMPLOYEEs can only create USER accounts.' });
      }
    }

    const hashedPassword = await bcrypt.hash(phone, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: finalRole,
      },
    });

    // Create client
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        joinedDate,
        status,
        revenue: revenue || 0,
        transactions: transactions || 0,
        loanAmount: loanAmount || 0,
        interestRate: interestRate || 0,
        loanTermMonths: loanTermMonths || 0,
        currentOutstandingLoanAmount: loanAmount || 0,
        userId: newUser.id,
      },
    });

    res.status(201).json({ client, user: newUser });
  } catch (err) {
    console.error('Error creating client and user:', err);
    res.status(400).json({ message: err.message });
  }
});


// // UPDATE a client
// router.put('/:id', async (req, res) => {
//   try {
//     const client = await prisma.client.update({
//       where: { id: parseInt(req.params.id) },
//       data: req.body,
//     });
//     res.json(client);
//   } catch (err) {
//     console.error('Error updating client:', err);
//     res.status(400).json({ message: err.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const { paymentHistory, ...clientData } = req.body;

//     const updatedClient = await prisma.client.update({
//       where: { id: parseInt(req.params.id) },
//       data: {
//         ...clientData,
//         paymentHistory: {
//           deleteMany: {}, // delete existing payment history
//           create: paymentHistory, // create new entries
//         },
//       },
//       include: {
//         paymentHistory: true,
//       },
//     });

//     res.json(updatedClient);
//   } catch (err) {
//     console.error('Error updating client:', err);
//     res.status(400).json({ message: err.message });
//   }
// });

// UPDATE a client
router.put('/:id',auth, authorize('ADMIN'), async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const { paymentHistory, ...clientData } = req.body;

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...clientData,
        paymentHistory: {
          deleteMany: {}, // Deletes all existing payment history for this client
          create: paymentHistory.map(ph => ({
            // Don't include `id` or `clientId` — Prisma sets these
            paymentDate: ph.paymentDate,
            amountPaid: ph.amountPaid,
            principalPaid: ph.principalPaid,
            interestPaid: ph.interestPaid,
            remainingBalance: ph.remainingBalance,
            paymentMonth: ph.paymentMonth,
            paymentYear: ph.paymentYear
          }))
        }
      },
      include: {
        paymentHistory: true
      }
    });

    res.json(updatedClient);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(400).json({ message: err.message });
  }
});


// DELETE client
router.delete('/:id',auth, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.paymentHistory.deleteMany({ where: { clientId: parseInt(req.params.id) } });
    await prisma.client.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Client deleted successfully.' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ message: 'Server error deleting client.' });
  }
});

// RECORD PAYMENT
router.put('/:id/record-payment', auth, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const { amountPaid, paymentDate } = req.body;

    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { paymentHistory: true },
    });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (client.currentOutstandingLoanAmount <= 0) {
      return res.status(400).json({ message: 'Loan is already fully paid.' });
    }

    const remainingLoanTerm = client.loanTermMonths - client.paymentHistory.length;

    const { interestPortion, principalPortion } = calculateLoanPaymentDetails(
      client.currentOutstandingLoanAmount,
      client.interestRate,
      remainingLoanTerm > 0 ? remainingLoanTerm : 1
    );

    let actualPrincipalPaid = 0;
    let actualInterestPaid = 0;

    if (amountPaid >= interestPortion) {
      actualInterestPaid = interestPortion;
      actualPrincipalPaid = Math.min(amountPaid - interestPortion, principalPortion, client.currentOutstandingLoanAmount);
    } else {
      actualInterestPaid = amountPaid;
    }

    const newOutstanding = Math.max(0, client.currentOutstandingLoanAmount - actualPrincipalPaid);

    await prisma.client.update({
      where: { id: parseInt(req.params.id) },
      data: {
        currentOutstandingLoanAmount: newOutstanding,
        transactions: { increment: 1 },
      },
    });

    const dateOfPayment = paymentDate ? new Date(paymentDate) : new Date();
    await prisma.paymentHistory.create({
      data: {
        clientId: client.id,
        paymentDate: dateOfPayment,
        amountPaid,
        principalPaid: actualPrincipalPaid,
        interestPaid: actualInterestPaid,
        remainingBalance: newOutstanding,
        paymentMonth: dateOfPayment.getMonth() + 1,
        paymentYear: dateOfPayment.getFullYear(),
      },
    });

    res.json({ message: 'Payment recorded successfully!' });
  } catch (err) {
    console.error('Error recording payment:', err);
    res.status(500).json({ message: 'Server error recording payment.' });
  }
});

router.get('/me', auth, authorize('USER'), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { client: { include: { paymentHistory: true } } },
  });

  if (!user?.client) return res.status(404).json({ message: 'Client data not found' });
  res.json(user.client);
});

module.exports = router;