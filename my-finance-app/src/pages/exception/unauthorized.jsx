import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { ShieldOff } from 'lucide-react';

export default function UnauthorizedError() {
  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 480,
          textAlign: 'center',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'error.light',
          backgroundColor: 'error.lighter',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <ShieldOff size={48} color="#d32f2f" />
          <Typography variant="h5" fontWeight={600} color="error.main">
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This page is not authorized for you.
            <br />
            Please contact your admin for access.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}