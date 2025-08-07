import React, { useState } from 'react';
import { Typography, Box, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useAuth } from './auth/AuthContext';
import { toast } from 'react-toastify';

const Support = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { token } = useAuth() || {};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/support', form, {
        headers: {
           'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
         },
      });
      toast.success('Your message has been sent successfully!');
      setForm({ name: '', email: '', message: '' });

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        sx={{
          mb: 0.5,
          fontFamily: 'Roboto, sans-serif',
          fontStyle: 'normal',
          letterSpacing: 0.8,
          color: '#10154cff',
        }}
      >
        Contact Support
      </Typography>

      <Typography variant="body1" gutterBottom>
        If you have any questions or need help, feel free to reach out to our support team. We’re here to assist you.
      </Typography>

      <Box mt={2}>
        <Typography variant="subtitle1">
          <strong>Email:</strong> support@vizosfinanceapp.com
        </Typography>
        <Typography variant="subtitle1">
          <strong>Phone:</strong> +91-9876543210
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ mt: 4, p: 3, maxWidth: 500,}}>
        <Typography variant="h6" gutterBottom>
          Send Us a Message
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Your Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Your Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Support;
