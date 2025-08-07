import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './auth/AuthContext';
import { Typography } from '@mui/material';


const API_BASE = import.meta.env.VITE_APP_BASE_URL;


const MyPayment = () => {
  const [payments, setPayments] = useState([]);
  const { token } = useAuth() || {};

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/api/clients/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           }
//         });
//         setPayments(res.data);
//       } catch (err) {
//         console.error('Error fetching payment schedule:', err);
//       }
//     };

//     fetchPayments();
//   }, []);

return (
    <div>
    <Typography variant="h4" fontWeight={700} gutterBottom sx={{
        mb: 0.5,
        fontFamily: 'Roboto, sans-serif',
        fontStyle: 'normal',
        letterSpacing: 0.8,
        color: '#10154cff'
      }}>My Payment Schedule</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Here you can view your payment schedule and details.
      </Typography>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            Amount: ₹{payment.amount} | Due Date: {new Date(payment.due_date).toLocaleDateString()} | Status: {payment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPayment;
