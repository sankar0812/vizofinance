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

    await prisma.client.update({
      where: { email: req.user.email }, 
      data: { avatarId: newAvatar.id },
    });
    res.status(200).json({ message: 'Uploaded to DB', id: newAvatar.id });
  } catch (err) {
    console.error('Error saving to DB:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/avatar/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid image ID' });
  }

  try {
    const avatar = await prisma.avatar.findUnique({
      where: { id },
    });

    if (!avatar || !avatar.data) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.setHeader('Content-Type', avatar.mimetype);
    res.setHeader('Content-Length', avatar.data.length);
    res.send(Buffer.from(avatar.data));
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
