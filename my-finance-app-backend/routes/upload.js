// // routes/upload.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { PrismaClient } = require('@prisma/client');
// const { auth } = require('../middleware/auth');

// const prisma = new PrismaClient();

// // Use memory storage for multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // // POST /api/upload/avatar - Upload image to DB
// // router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
// //   const file = req.file;

// //   if (!file) {
// //     return res.status(400).json({ message: 'No file uploaded' });
// //   }

// //   try {
// //     const newAvatar = await prisma.avatar.create({
// //       data: {
// //         filename: file.originalname,
// //         mimetype: file.mimetype,
// //         data: file.buffer,
// //       },
// //     });

// //     res.status(200).json({ message: 'Uploaded to DB', id: newAvatar.id });
// //   } catch (err) {
// //     console.error('Error saving to DB:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   try {
//     const newAvatar = await prisma.avatar.create({
//       data: {
//         filename: file.originalname,
//         mimetype: file.mimetype,
//         data: Buffer.from(file.buffer), // Ensure it's a Buffer
//       },
//     });

//     res.status(200).json({ message: 'Uploaded to DB', id: newAvatar.id });
//   } catch (err) {
//     console.error('Error saving to DB:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // GET /api/upload/avatar/:id - Fetch image from DB
// router.get('/avatar/:id', async (req, res) => {
//   const id = parseInt(req.params.id);

//   try {
//     const avatar = await prisma.avatar.findUnique({
//       where: { id },
//     });

//     if (!avatar) {
//       return res.status(404).json({ message: 'Image not found' });
//     }

//     res.set('Content-Type', avatar.mimetype);
//     res.send(avatar.data);
//   } catch (err) {
//     console.error('Error retrieving image:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const prisma = new PrismaClient();

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload/avatar - Upload image to DB
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const newAvatar = await prisma.avatar.create({
      data: {
        filename: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer,
      },
    });

    res.status(200).json({ message: 'Uploaded to DB', id: newAvatar.id });
  } catch (err) {
    console.error('Error saving to DB:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/upload/avatar/:id - Fetch image from DB and serve as image
router.get('/avatar/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid image ID' });
  }

  try {
    const avatar = await prisma.avatar.findUnique({
      where: { id },
    });

    if (!avatar) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Set proper content type and return buffer
    res.set('Content-Type', avatar.mimetype);
    res.send(avatar.data);
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
