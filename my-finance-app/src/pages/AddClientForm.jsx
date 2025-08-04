import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Autocomplete,
  Box,
} from '@mui/material';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Briefcase,
  DollarSign,
  FileText,
  Percent,
  Clock,
} from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { generateId } from '../utils/helpers';
import { useClients } from '../utils/hooks/useClients';

const roles = ['USER', 'ADMIN'];
const statusOptions = ['Active', 'Inactive', 'Lead'];

const AddClientForm = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { data: clients, addClient, updateClient } = useClients();

  const clientToEdit = clients.find((c) => (c._id || c.id).toString() === clientId);

  const [client, setClient] = useState(
    clientToEdit || {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      joinedDate: '',
      status: 'Active',
      revenue: 0,
      transactions: 0,
      loanAmount: 0,
      interestRate: 0,
      loanTermMonths: 0,
      role: 'USER',
    }
  );

  useEffect(() => {
    if (clientToEdit) setClient(clientToEdit);
  }, [clientToEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = type === 'number' ? parseFloat(value) : value;

    setClient((prev) => {
      const updated = { ...prev, [name]: newValue };
      const currentLoanAmount = name === 'loanAmount' ? (parseFloat(newValue) || 0) : (prev.loanAmount || 0);
      const currentInterestRate = name === 'interestRate' ? (parseFloat(newValue) || 0) : (prev.interestRate || 0);
      const currentLoanTermMonths = name === 'loanTermMonths' ? (parseFloat(newValue) || 0) : (prev.loanTermMonths || 0);
      // updated.revenue = currentLoanAmount > 0 && currentInterestRate > 0
      //   ? parseFloat(((currentLoanAmount * currentInterestRate) / 100).toFixed(2))
      //   : 0;
      // updated.revenue = currentLoanAmount > 0 && currentInterestRate > 0 && currentLoanTermMonths > 0
      //   ? parseFloat(((currentLoanAmount * currentInterestRate * currentLoanTermMonths) / (100 * 12)).toFixed(2))
      //   : 0;

      updated.revenue = currentLoanAmount > 0 && currentInterestRate > 0 && currentLoanTermMonths > 0
        ? (() => {
          const P = currentLoanAmount;
          const r = currentInterestRate / 12 / 100;
          const n = currentLoanTermMonths;

          const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
          const totalPayment = emi * n;
          return parseFloat((totalPayment - P).toFixed(2)); // Revenue = total interest
        })()
        : 0;

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clientToEdit) {
      updateClient(client);
    } else {
      addClient({ ...client, id: client.id || generateId() });
    }
    navigate('/dashboard/clients');
  };


  return (
    <Dialog open onClose={() => navigate('/dashboard/clients')} maxWidth="md" fullWidth>
      <DialogTitle>{clientToEdit ? 'Edit Client' : 'Add New Client'}</DialogTitle>
      <DialogContent dividers>
        <form id="add-client-form" onSubmit={handleSubmit}>
          <div className="container">
            {/* Row 1 */}
            <div className="row g-3">
              <div className="col-md-12">
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Client Name"
                  name="name"
                  value={client.name}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Email"
                  name="email"
                  value={client.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  label="Phone"
                  name="phone"
                  value={client.phone}
                  onChange={handleChange}
                  placeholder="Enter phone"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  label="Address"
                  name="address"
                  value={client.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="col-md-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Joined Date"
                    value={client.joinedDate ? new Date(client.joinedDate) : null}
                    onChange={(newValue) =>
                      handleChange({ target: { name: 'joinedDate', value: newValue } })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        name: 'joinedDate',
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon size={16} />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="col-md-4">
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Status"
                  name="status"
                  value={client.status || 'Active'}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Briefcase size={16} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

              </div>

              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Revenue"
                  name="revenue"
                  value={client.revenue}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DollarSign size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Transactions"
                  name="transactions"
                  value={client.transactions}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FileText size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Loan Amount"
                  name="loanAmount"
                  value={client.loanAmount}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DollarSign size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Interest Rate (%)"
                  name="interestRate"
                  value={client.interestRate}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Percent size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Loan Term (Months)"
                  name="loanTermMonths"
                  value={client.loanTermMonths}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Clock size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-4">
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Role"
                  name="role"
                  value={client.role || 'USER'}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Briefcase size={16} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>

              </div>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button sx={{ m: 2 }} onClick={() => navigate('/dashboard/clients')} color="inherit">
          Cancel
        </Button>
        <Button sx={{ m: 2 }} type="submit" form="add-client-form" variant="contained">
          Save Client
        </Button>
      </DialogActions>
    </Dialog>
  );

};

export default AddClientForm;


// ----- Daily and Monthly Loan Term Calculation -----


// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   TextField,
//   MenuItem,
//   Button,
//   Grid,
//   Typography,
//   Paper,
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { generateId } from '../utils/helpers';
// import { useClients } from '../utils/hooks/useClients';

// const roles = ['USER', 'ADMIN', 'EMPLOYEE'];
// const statusOptions = ['Active', 'Inactive', 'Lead'];
// const loanTermTypes = ['Monthly', 'Daily'];

// const AddClientForm = () => {
//   const { clientId } = useParams();
//   const navigate = useNavigate();
//   const { data: clients, addClient, updateClient } = useClients();

//   const clientToEdit = clients.find((c) => (c._id || c.id).toString() === clientId);

//   const [client, setClient] = useState(
//     clientToEdit || {
//       id: '',
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       joinedDate: '',
//       status: 'Active',
//       revenue: 0,
//       transactions: 0,
//       loanAmount: 0,
//       interestRate: 0,
//       loanTerm: 0,
//       loanTermType: 'Monthly',
//       role: 'USER',
//     }
//   );

//   useEffect(() => {
//     if (clientToEdit) setClient(clientToEdit);
//   }, [clientToEdit]);

//   const calculateRevenue = (loanAmount, interestRate, term, type) => {
//     if (loanAmount > 0 && interestRate > 0 && term > 0) {
//       const P = loanAmount;
//       const r = type === 'Monthly' ? interestRate / 12 / 100 : interestRate / 30 / 100;
//       const n = term;

//       const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
//       const totalPayment = emi * n;
//       return parseFloat((totalPayment - P).toFixed(2));
//     }
//     return 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     const newValue = type === 'number' ? parseFloat(value) : value;

//     setClient((prev) => {
//       const updated = { ...prev, [name]: newValue };

//       const currentLoanAmount = name === 'loanAmount' ? parseFloat(newValue) || 0 : prev.loanAmount || 0;
//       const currentInterestRate = name === 'interestRate' ? parseFloat(newValue) || 0 : prev.interestRate || 0;
//       const currentLoanTerm = name === 'loanTerm' ? parseFloat(newValue) || 0 : prev.loanTerm || 0;
//       const currentLoanTermType = name === 'loanTermType' ? newValue : prev.loanTermType;

//       updated.revenue = calculateRevenue(
//         currentLoanAmount,
//         currentInterestRate,
//         currentLoanTerm,
//         currentLoanTermType
//       );

//       return updated;
//     });
//   };

//   const handleDateChange = (newDate) => {
//     setClient((prev) => ({ ...prev, joinedDate: newDate }));
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (clientToEdit) {
//       updateClient(client);
//     } else {
//       addClient({ ...client, id: client.id || generateId() });
//     }
//     navigate('/dashboard/clients');
//   };


//   return (
//     <Paper sx={{ p: 3, mt: 2 }}>
//       <Typography variant="h5" gutterBottom>
//         {clientToEdit ? 'Edit Client' : 'Add New Client'}
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="name"
//             label="Name"
//             value={client.name}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="email"
//             label="Email"
//             value={client.email}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="phone"
//             label="Phone"
//             value={client.phone}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="address"
//             label="Address"
//             value={client.address}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Joined Date"
//               value={client.joinedDate || null}
//               onChange={handleDateChange}
//               renderInput={(params) => <TextField fullWidth {...params} />}
//             />
//           </LocalizationProvider>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             select
//             fullWidth
//             name="status"
//             label="Status"
//             value={client.status}
//             onChange={handleChange}
//           >
//             {statusOptions.map((status) => (
//               <MenuItem key={status} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="loanAmount"
//             label="Loan Amount"
//             type="number"
//             value={client.loanAmount}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="interestRate"
//             label="Interest Rate (%)"
//             type="number"
//             value={client.interestRate}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="loanTerm"
//             label={`Loan Term (${client.loanTermType === 'Monthly' ? 'months' : 'days'})`}
//             type="number"
//             value={client.loanTerm}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             select
//             fullWidth
//             name="loanTermType"
//             label="Loan Term Type"
//             value={client.loanTermType}
//             onChange={handleChange}
//           >
//             {loanTermTypes.map((type) => (
//               <MenuItem key={type} value={type}>
//                 {type}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             name="revenue"
//             label="Revenue"
//             value={client.revenue}
//             InputProps={{
//               readOnly: true,
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             select
//             fullWidth
//             name="role"
//             label="Role"
//             value={client.role}
//             onChange={handleChange}
//           >
//             {roles.map((role) => (
//               <MenuItem key={role} value={role}>
//                 {role}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12}>
//           <Button variant="contained" onClick={handleSubmit}>
//             {clientToEdit ? 'Update Client' : 'Add Client'}
//           </Button>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default AddClientForm;
