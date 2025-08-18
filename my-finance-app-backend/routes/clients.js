const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { auth, authorize } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/mailer');

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
router.get('/', auth, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
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
router.get('/:id', auth, authorize('ADMIN', 'USER'), async (req, res) => {
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
      password, role
    } = req.body;

    // Check if client with email already exists
    const existingClient = await prisma.client.findUnique({ where: { email } });
    if (existingClient) {
      return res.status(400).json({ message: 'Client with this email already exists.' });
    }

    // Validate and restrict role assignment
    let finalRole = 'USER'; // Default fallback
    const currentUserRole = req.user.role;

    if (currentUserRole === 'ADMIN') {
      if (['USER', 'EMPLOYEE', 'ADMIN'].includes(role)) {
        finalRole = role;
      }
    } else if (currentUserRole === 'EMPLOYEE') {
      if (role === 'USER') {
        finalRole = 'USER';
      } else {
        return res.status(403).json({ message: 'Employees can only create USER accounts.' });
      }
    }

    // Use phone as password fallback if not provided
    const rawPassword = password || phone;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create new client
    const client = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        joinedDate: joinedDate || new Date().toISOString(),
        status: status || 'Active',
        revenue: revenue || 0,
        transactions: transactions || 0,
        loanAmount: loanAmount || 0,
        interestRate: interestRate || 0,
        loanTermMonths: loanTermMonths || 0,
        currentOutstandingLoanAmount: loanAmount || 0,
        role: finalRole,
      },
    });

    // Send welcome email
    await sendMail(
      client.email,
      'Welcome to VizoFinance!',
      `
      <h3>Hello ${client.name},</h3>
      <p>Welcome to <strong>VizoFinance</strong>! Your account has been successfully created.</p>
      <p>Here are your details:</p>
      <ul>
        <li><strong>Email:</strong> ${client.email}</li>
        <li><strong>Phone:</strong> ${client.phone}</li>
        <li><strong>Loan Amount:</strong> ₹${client.loanAmount}</li>
        <li><strong>Interest Rate:</strong> ${client.interestRate}%</li>
        <li><strong>Loan Term:</strong> ${client.loanTermMonths} months</li>
      </ul>
      <p>You can now log in and start managing your loans.</p>
      <br/>
      <p>Regards,<br/>VizoFinance Team</p>
      `
    );

    console.log('Client creation email sent successfully.');

    res.status(201).json({ client });
  } catch (err) {
    console.error('Error creating client:', err);
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
router.put('/:id', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const { paymentHistory, email, ...clientData } = req.body;

    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      include: { paymentHistory: true },
    });

    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found.' });
    }

    // Check if the new email is already used by another client
    if (email && email !== existingClient.email) {
      const emailTaken = await prisma.client.findUnique({ where: { email } });
      if (emailTaken && emailTaken.id !== clientId) {
        return res.status(400).json({ message: 'Email already in use by another client.' });
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...clientData,
        email: email || existingClient.email,
        paymentHistory: paymentHistory
          ? {
            deleteMany: {}, // clear old
            create: paymentHistory.map(ph => ({
              paymentDate: ph.paymentDate,
              amountPaid: ph.amountPaid,
              principalPaid: ph.principalPaid,
              interestPaid: ph.interestPaid,
              remainingBalance: ph.remainingBalance,
              paymentMonth: ph.paymentMonth,
              paymentYear: ph.paymentYear,
            })),
          }
          : undefined,
      },
      include: { paymentHistory: true },
    });

    res.json(updatedClient);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE client
router.delete('/:id', auth, authorize('ADMIN'), async (req, res) => {
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

    console.log(client.email, 'Client Email');

    // Send Mail
    await sendMail(
      client.email,
      'Loan Payment Confirmation',
      `
      <h3>Hello ${client.name},</h3>
      <p>Thank you for your payment.</p>
      <p><strong>Amount Paid:</strong> ₹${amountPaid}</p>
      <p><strong>Principal Paid:</strong> ₹${actualPrincipalPaid}</p>
      <p><strong>Interest Paid:</strong> ₹${actualInterestPaid}</p>
      <p><strong>Remaining Balance:</strong> ₹${newOutstanding}</p>
      <p>Date: ${dateOfPayment.toLocaleDateString()}</p>
      <br/>
      <p>Regards,<br/>VizoFinance App Team</p>
      `
    );

    console.log('Mail sent succesfuly');


    res.json({ message: 'Payment recorded and confirmation email sent successfully!' });
  } catch (err) {
    console.error('Error recording payment:', err);
    res.status(500).json({ message: 'Server error recording payment.' });
  }
});


// router.get('/me', auth, authorize('USER'), async (req, res) => {
//   if (req.user.role === 'USER') {
//     const client = await prisma.client.findUnique({
//       where: { userId: req.user.id },
//       include: { paymentHistory: true },
//     });

//     if (!client) {
//       return res.status(404).json({ message: 'Client data not found' });
//     }

//     return res.json(client);
//   }
// });

router.get('/me', auth, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        paymentHistory: true,
      },
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (err) {
    console.error('GET /api/clients/me failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// router.get('/me', auth, async (req, res) => {
//   try {
//     const client = await prisma.client.findUnique({
//       where: { userId: req.user.id },
//     });

//     if (!client) {
//       return res.status(404).json({ message: 'Client not found' });
//     }

//     res.json(client);
//   } catch (err) {
//     console.error('GET /api/clients/me failed:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.put('/:clientId/assign', auth, authorize('ADMIN'), async (req, res) => {
  const { clientId } = req.params;
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Make sure employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const updatedClient = await prisma.client.update({
      where: { id: parseInt(clientId) },
      data: {
        assignedTo: parseInt(employeeId),
      },
    });
    console.log('Client assigned to employee successfully:', updatedClient);

    res.status(200).json({
      message: 'Client assigned successfully',
      client: updatedClient,
    });
  } catch (err) {
    console.error('Error assigning client:', err);
    res.status(500).json({ message: 'Server error while assigning client.' });
  }
});

router.put('/:clientId/unassign', auth, authorize('ADMIN'), async (req, res) => {
  const { clientId } = req.params;
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) },
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Make sure employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const updatedClient = await prisma.client.update({
      where: { id: parseInt(clientId) },
      data: {
        assignedTo: null, // Unassign the client
      },
    });
    console.log('Client assigned to employee successfully:', updatedClient);

    res.status(200).json({
      message: 'Client assigned successfully',
      client: updatedClient,
    });
  } catch (err) {
    console.error('Error assigning client:', err);
    res.status(500).json({ message: 'Server error while assigning client.' });
  }
});

router.get(
  "/client/dashboard",
  auth,
  authorize('ADMIN', 'EMPLOYEE', 'USER'), // include USER
  async (req, res) => {
    const client = await prisma.client.findUnique({
      where: { email: req.user.email },
      include: {
        paymentHistory: true, // use PaymentHistory relation, not loanPayments
      },
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  }
);

module.exports = router;