require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prismaClient');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to PostgreSQL');
  } catch (err) {
    console.error('❌ Error during startup:', err);
  }
})();

// Routes
const adminRouter = require('./routes/admin');
app.use('/api/admin', adminRouter);

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

const supportRouter = require('./routes/support');
app.use('/api/support', supportRouter);

