const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const sendMail = require('../utils/mailer');

// POST /api/support
router.post('/', auth, authorize('ADMIN', 'EMPLOYEE', 'USER'), async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendMail(
      process.env.EMAIL_USER,
      `Support Request from ${name}`,
      `
        <h3>Support Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>This email was sent from the VizoFinance App contact form.</p>
      `,
      email
    );

    console.log('Support email sent successfully');
    res.json({ message: 'Support message sent successfully.' });
  } catch (error) {
    console.error('Error sending support email:', error);
    res.status(500).json({ message: 'Failed to send support message.' });
  }
});

module.exports = router;