import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from '@mui/material';
import { useAuth } from './auth/AuthContext';

const API_BASE = import.meta.env.VITE_APP_BASE_URL;

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = (useAuth() || {});


//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/api/clients/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setLoans(res.data);
//       } catch (err) {
//         console.error('Failed to load loan details:', err);
//         setError('Failed to load loan details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) fetchLoans();
//     else {
//       setError('No authentication token found.');
//       setLoading(false);
//     }
//   }, [token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={4}>
        {error}
      </Typography>
    );
  }

  if (loans.length === 0) {
    return (
      <Typography variant="h6" mt={4}>
        No loan records found.
      </Typography>
    );
  }

  return (
    <Box mt={2}>
      <Typography variant="h5" gutterBottom>
        My Loan Details
      </Typography>
      <Grid container spacing={2}>
        {loans.map((loan) => (
          <Grid item xs={12} md={6} key={loan.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1">
                  Loan ID: {loan.id}
                </Typography>
                <Typography>Amount: ₹{loan.amount}</Typography>
                <Typography>Status: {loan.status}</Typography>
                <Typography>
                  Issued On: {new Date(loan.issuedAt).toLocaleDateString()}
                </Typography>
                <Typography>
                  Due Date: {new Date(loan.dueDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyLoans;
