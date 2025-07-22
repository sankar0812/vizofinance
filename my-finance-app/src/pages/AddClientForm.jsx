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
import { generateId } from '../utils/helpers';
import { useClients } from '../utils/hooks/useClients';

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
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Client Name"
                name="name"
                size='small'
                value={client.name}
                onChange={handleChange}
                InputProps={{ startAdornment: <User size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                size='small'
                type="email"
                label="Email"
                name="email"
                value={client.email}
                onChange={handleChange}
                InputProps={{ startAdornment: <Mail size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                label="Phone"
                name="phone"
                value={client.phone}
                onChange={handleChange}
                InputProps={{ startAdornment: <Phone size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                label="Address"
                name="address"
                value={client.address}
                onChange={handleChange}
                InputProps={{ startAdornment: <MapPin size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                type="date"
                label="Joined Date"
                name="joinedDate"
                value={client.joinedDate}
                onChange={handleChange}
                InputProps={{ startAdornment: <CalendarIcon size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                size='small'
                label="Status"
                name="status"
                value={client.status}
                onChange={handleChange}
                InputProps={{ startAdornment: <Briefcase size={16} style={{ marginRight: 8 }} /> }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Lead">Lead</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                type="number"
                label="Revenue"
                name="revenue"
                value={client.revenue}
                onChange={handleChange}
                InputProps={{ startAdornment: <DollarSign size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                type="number"
                label="Transactions"
                name="transactions"
                value={client.transactions}
                onChange={handleChange}
                InputProps={{ startAdornment: <FileText size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                type="number"
                label="Loan Amount"
                name="loanAmount"
                value={client.loanAmount}
                onChange={handleChange}
                InputProps={{ startAdornment: <DollarSign size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                type="number"
                step="0.01"
                label="Interest Rate (%)"
                name="interestRate"
                value={client.interestRate}
                onChange={handleChange}
                InputProps={{ startAdornment: <Percent size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size='small'
                type="number"
                label="Loan Term (Months)"
                name="loanTermMonths"
                value={client.loanTermMonths}
                onChange={handleChange}
                InputProps={{ startAdornment: <Clock size={16} style={{ marginRight: 8 }} /> }}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate('/dashboard/clients')} color="inherit">Cancel</Button>
        <Button type="submit" form="add-client-form" variant="contained">Save Client</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientForm;