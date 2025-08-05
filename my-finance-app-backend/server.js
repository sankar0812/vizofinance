require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const prisma = require('./prismaClient');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to PostgreSQL');

    const existingAdmin = await prisma.client.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const admin = await prisma.client.create({
        data: {
          name: process.env.ADMIN_NAME || 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          phone: '',
          address: '',
          role: 'ADMIN',
          status: 'Active',
        },
      });

      console.log('Default admin user created:', admin.email);
    } else {
      console.log('Admin user already exists:', existingAdmin.email);
    }

  } catch (err) {
    console.error('❌ Error during startup:', err);
  }
})();

// Routes
const clientsRouter = require('./routes/clients');
app.use('/api/clients', clientsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const employeeRoutes = require('./routes/employee');
app.use('/api/employees', employeeRoutes);

const uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);

app.get('/', (req, res) => {
  res.send('Finance App Backend is running!');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});