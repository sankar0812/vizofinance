require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const prisma = require('./prismaClient');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// cors({
//   origin: '*',
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization',
// });
app.use(express.json());


// Test DB connection
(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected to PostgreSQL');
  } catch (err) {
    console.error('Prisma connection error:', err);
  }
})();

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// Routes
const clientsRouter = require('./routes/clients');
app.use('/api/clients', clientsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Finance App Backend is running!');
});
