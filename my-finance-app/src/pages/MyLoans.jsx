// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Box,
//   Grid,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip
// } from '@mui/material';
// import { useAuth } from './auth/AuthContext';

// const API_BASE = import.meta.env.VITE_APP_BASE_URL;

// const MyLoans = () => {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { token } = useAuth() || {};

//   useEffect(() => {
//     const fetchLoans = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/api/clients/client/dashboard`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         console.log("API Response:", res.data);

//         // Wrap single object in array to use .map()
//         setLoans(res.data ? [res.data] : []);
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

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography color="error" mt={4}>
//         {error}
//       </Typography>
//     );
//   }

//   if (loans.length === 0) {
//     return (
//       <Typography variant="h6" mt={4}>
//         No loan records found.
//       </Typography>
//     );
//   }

//   return (
//     <Box mt={2}>
//       <Typography variant="h5" gutterBottom>
//         My Loan Details
//       </Typography>
//       <Grid container spacing={2}>
//         {loans.map((loan) => {
//           // calculate totals
//           const totalPrincipal = loan.paymentHistory?.reduce(
//             (sum, p) => sum + (p.principalPaid || 0),
//             0
//           );
//           const totalInterest = loan.paymentHistory?.reduce(
//             (sum, p) => sum + (p.interestPaid || 0),
//             0
//           );
//           const totalPaid = loan.paymentHistory?.reduce(
//             (sum, p) => sum + (p.amountPaid || 0),
//             0
//           );

//           return (
//             <Grid item xs={12} md={8} key={loan.id}>
//               <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     {loan.name}
//                   </Typography>
//                   <Typography>Email: {loan.email}</Typography>
//                   <Typography>Phone: {loan.phone}</Typography>
//                   <Divider sx={{ my: 2 }} />

//                   <Typography>Loan Amount: ₹{loan.loanAmount}</Typography>
//                   <Typography>Outstanding: ₹{loan.currentOutstandingLoanAmount}</Typography>
//                   <Typography>Interest Rate: {loan.interestRate}%</Typography>
//                   <Typography>Loan Term: {loan.loanTermMonths} months</Typography>
//                   <Typography>Status: {loan.status}</Typography>
//                   <Typography>Interest: ₹{loan.revenue}</Typography>
//                   <Typography>
//                     Issued On: {new Date(loan.createdAt).toLocaleDateString()}
//                   </Typography>
//                   <Typography>
//                     Due Date: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "N/A"}
//                   </Typography>

//                   <Divider sx={{ my: 2 }} />

//                   <Typography variant="h6" gutterBottom>
//                     Payment History
//                   </Typography>

//                   {loan.paymentHistory && loan.paymentHistory.length > 0 ? (
//                     <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow>
//                             <TableCell><b>Date</b></TableCell>
//                             <TableCell align="right"><b>Total Paid</b></TableCell>
//                             <TableCell align="right"><b>Principal</b></TableCell>
//                             <TableCell align="right"><b>Interest</b></TableCell>
//                             <TableCell align="center"><b>Status</b></TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {loan.paymentHistory.map((p) => (
//                             <TableRow key={p.id}>
//                               <TableCell>
//                                 {new Date(p.paymentDate).toLocaleDateString()}
//                               </TableCell>
//                               <TableCell align="right">₹{p.amountPaid.toFixed(2)}</TableCell>
//                               <TableCell align="right">₹{p.principalPaid.toFixed(2)}</TableCell>
//                               <TableCell align="right">₹{p.interestPaid.toFixed(2)}</TableCell>
//                               <TableCell align="center">
//                                 <Chip
//                                   label="Paid"
//                                   color="success"
//                                   size="small"
//                                   variant="outlined"
//                                 />
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                           {/* Totals row */}
//                           <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                             <TableCell><b>Total</b></TableCell>
//                             <TableCell align="right"><b>₹{totalPaid.toFixed(2)}</b></TableCell>
//                             <TableCell align="right"><b>₹{totalPrincipal.toFixed(2)}</b></TableCell>
//                             <TableCell align="right"><b>₹{totalInterest.toFixed(2)}</b></TableCell>
//                             <TableCell />
//                           </TableRow>
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   ) : (
//                     <Typography>No payments made yet.</Typography>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>
//     </Box>
//   );
// };

// export default MyLoans;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import { useAuth } from './auth/AuthContext';

// Icons
import { User, Mail, Phone, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const API_BASE = import.meta.env.VITE_APP_BASE_URL;

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth() || {};

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/clients/client/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoans(res.data ? [res.data] : []);
      } catch (err) {
        console.error('Failed to load loan details:', err);
        setError('Failed to load loan details.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchLoans();
    else {
      setError('No authentication token found.');
      setLoading(false);
    }
  }, [token]);

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
    <Box mt={2} >
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Loan Dashboard
      </Typography>
      <Grid container spacing={3}>
        {loans.map((loan) => {
          // calculate totals
          const totalPrincipal = loan.paymentHistory?.reduce(
            (sum, p) => sum + (p.principalPaid || 0),
            0
          );
          const totalInterest = loan.paymentHistory?.reduce(
            (sum, p) => sum + (p.interestPaid || 0),
            0
          );
          const totalPaid = loan.paymentHistory?.reduce(
            (sum, p) => sum + (p.amountPaid || 0),
            0
          );

          return (
            <Grid item xs={12} md={10} key={loan.id}>
              {/* Loan Info Card */}
              <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                    color: 'white',
                    p: 3,
                  }}
                >
                  {/* <Typography variant="h6" fontWeight={700}>
                    {loan.name}
                  </Typography>
                  <Typography variant="body2">{loan.email}</Typography>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#e0f2fe' }}>
                          <Phone color="#0284c7" size={20} />
                        </Avatar>
                        <Typography>{loan.phone}</Typography>
                      </Stack>
                    </Grid>  */}

                    <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Left Side: Name */}
        <Typography variant="h6" fontWeight={700}>
          {loan.name}
        </Typography>

                    {/* Right Side: Email + Phone */}
                    <Stack direction="row" spacing={3} alignItems="center">
                      {/* Email */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ bgcolor: '#f3e8ff', width: 30, height: 30 }}>
                          <Mail style={{ color: '#7e22ce' }} fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">{loan.email}</Typography>
                      </Stack>

                      {/* Phone */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ bgcolor: '#e0f2fe', width: 30, height: 30 }}>
                          <Phone style={{ color: '#0284c7' }} fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">{loan.phone}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>

                <CardContent>
                  <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#fef9c3' }}>
                          <DollarSign color="#ca8a04" size={20} />
                        </Avatar>
                        <Typography>Loan Amount: ₹{loan.loanAmount}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#fef2f2' }}>
                          <TrendingUp color="#dc2626" size={20} />
                        </Avatar>
                        <Typography>Outstanding: ₹{loan.currentOutstandingLoanAmount}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#f0f9ff' }}>
                          <DollarSign color="#0284c7" size={20} />
                        </Avatar>
                        <Typography>Interest Rate: {loan.interestRate}%</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#f0f9ff' }}>
                          <Calendar color="#0284c7" size={20} />
                        </Avatar>
                        <Typography>
                          Loan Term: {loan.loanTermMonths} months
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#fef3c7' }}>
                          <Calendar color="#ca8a04" size={20} />
                        </Avatar>
                        <Typography>Status: {loan.status}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#ecfdf5' }}>
                          <Calendar color="#16a34a" size={20} />
                        </Avatar>
                        <Typography>
                          Issued On: {new Date(loan.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Payment History */}
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Payment History
                  </Typography>

                  {loan.paymentHistory && loan.paymentHistory.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
                          <TableRow>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell align="right"><b>Total Paid</b></TableCell>
                            <TableCell align="right"><b>Principal</b></TableCell>
                            <TableCell align="right"><b>Interest</b></TableCell>
                            <TableCell align="center"><b>Status</b></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loan.paymentHistory.map((p) => (
                            <TableRow key={p.id} hover>
                              <TableCell>
                                {new Date(p.paymentDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell align="right">₹{p.amountPaid.toFixed(2)}</TableCell>
                              <TableCell align="right">₹{p.principalPaid.toFixed(2)}</TableCell>
                              <TableCell align="right">₹{p.interestPaid.toFixed(2)}</TableCell>
                              <TableCell align="center">
                                <Chip
                                  label="Paid"
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Totals row */}
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><b>Total</b></TableCell>
                            <TableCell align="right"><b>₹{totalPaid.toFixed(2)}</b></TableCell>
                            <TableCell align="right"><b>₹{totalPrincipal.toFixed(2)}</b></TableCell>
                            <TableCell align="right"><b>₹{totalInterest.toFixed(2)}</b></TableCell>
                            <TableCell />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No payments made yet.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MyLoans;
