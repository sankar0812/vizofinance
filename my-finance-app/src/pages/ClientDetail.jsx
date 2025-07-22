import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  TextField,
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
  Calculator,
  Edit,
  Trash2,
} from 'lucide-react';
import { formatINR } from '../utils/currency.js';
import { calculateLoanPayment } from '../utils/loanCalculations.jsx';
import LoanAmortization from './LoanAmortization.jsx';
import { useClients } from '../utils/hooks/useClients';

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary' }}>
    {icon}
    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{label}:</Typography>
    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 400 }}>{value}</Typography>
  </Stack>
);

const ClientDetail = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { data: clients, deleteClient } = useClients();

  const client = clients.find((c) => (c._id || c.id).toString() === clientId);

  const [showAmortization, setShowAmortization] = useState(false);
  const [scenarioLoanAmount, setScenarioLoanAmount] = useState(client?.loanAmount || 0);
  const [scenarioInterestRate, setScenarioInterestRate] = useState(client?.interestRate || 0);
  const [scenarioLoanTermMonths, setScenarioLoanTermMonths] = useState(client?.loanTermMonths || 0);

  const baseCalc = useMemo(() => {
    if (!client) return {};
    return calculateLoanPayment(client.loanAmount, client.interestRate, client.loanTermMonths);
  }, [client]);

  const scenarioCalc = useMemo(
    () => calculateLoanPayment(scenarioLoanAmount, scenarioInterestRate, scenarioLoanTermMonths),
    [scenarioLoanAmount, scenarioInterestRate, scenarioLoanTermMonths]
  );

  const handleDelete = () => {
    deleteClient(clientId);
    navigate('/dashboard/clients');
  };

  const handleEdit = () => navigate(`/dashboard/clients/${clientId}/edit`);
  const handleBack = () => navigate('/dashboard/clients');

  const resetScenario = () => {
    setScenarioLoanAmount(client.loanAmount);
    setScenarioInterestRate(client.interestRate);
    setScenarioLoanTermMonths(client.loanTermMonths);
  };

  if (!client) {
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Client Details</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>Client not found.</Typography>
        <Button variant="contained" onClick={handleBack}>Back to Clients</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'grey.100', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" spacing={2}>
        <Typography variant="h3" fontWeight={800} color="text.primary">
          Client Details: {client.name}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<Edit size={20} />} variant="contained" color="warning" onClick={handleEdit}>
            Edit
          </Button>
          <Button startIcon={<Trash2 size={20} />} variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* General Info */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom>General Information</Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}><InfoRow icon={<User size={20} color="#3b82f6" />} label="Name" value={client.name} /></Grid>
          <Grid item xs={12} md={6}><InfoRow icon={<Mail size={20} color="#3b82f6" />} label="Email" value={client.email} /></Grid>
          <Grid item xs={12} md={6}><InfoRow icon={<Phone size={20} color="#3b82f6" />} label="Phone" value={client.phone} /></Grid>
          <Grid item xs={12} md={6}><InfoRow icon={<MapPin size={20} color="#3b82f6" />} label="Address" value={client.address} /></Grid>
          <Grid item xs={12} md={6}><InfoRow icon={<CalendarIcon size={20} color="#3b82f6" />} label="Joined Date" value={client.joinedDate} /></Grid>
          <Grid item xs={12} md={6}><InfoRow icon={<Briefcase size={20} color="#3b82f6" />} label="Status" value={client.status} /></Grid>
          <Grid item xs={12} md={6}><InfoRow icon={<DollarSign size={20} color="#3b82f6" />} label="Total Revenue" value={formatINR(client.revenue)} /></Grid>
          <Grid item xs={12} md={6}><InfoRow icon={<FileText size={20} color="#3b82f6" />} label="Total Transactions" value={client.transactions} /></Grid>
        </Grid>
      </Paper>

      {/* Loan Details & Calculation */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Loan Details & Calculation</Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}><InfoRow icon={<DollarSign size={20} color="#22c55e" />} label="Loan Amount" value={formatINR(client.loanAmount)} /></Grid>
          <Grid item xs={12} md={4}><InfoRow icon={<Percent size={20} color="#22c55e" />} label="Interest Rate (Annual)" value={`${client.interestRate}%`} /></Grid>
          <Grid item xs={12} md={4}><InfoRow icon={<Clock size={20} color="#22c55e" />} label="Loan Term (Months)" value={client.loanTermMonths} /></Grid>
        </Grid>

        {client.loanAmount > 0 && client.loanTermMonths > 0 && client.interestRate >= 0 ? (
          <Paper variant="outlined" sx={{ mt: 4, p: 3, bgcolor: 'primary.50' }}>
            <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>Calculated Loan Payments</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><InfoRow icon={<DollarSign size={20} />} label="Monthly Payment" value={formatINR(baseCalc.monthlyPayment)} /></Grid>
              <Grid item xs={12} md={4}><InfoRow icon={<DollarSign size={20} />} label="Total Interest Paid" value={formatINR(baseCalc.totalInterest)} /></Grid>
              <Grid item xs={12} md={4}><InfoRow icon={<DollarSign size={20} />} label="Total Amount Paid" value={formatINR(baseCalc.totalAmount)} /></Grid>
            </Grid>
            <Box textAlign="center" mt={3}>
              <Button
                startIcon={<Calculator size={20} />}
                variant="contained"
                color="secondary"
                onClick={() => setShowAmortization((s) => !s)}
              >
                {showAmortization ? 'Hide Amortization Schedule' : 'View Amortization Schedule'}
              </Button>
            </Box>
          </Paper>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            Enter Loan Amount, Interest Rate, and Loan Term to see calculations.
          </Typography>
        )}
      </Paper>

      {showAmortization && (
        <LoanAmortization
          loanAmount={client.loanAmount}
          annualInterestRate={client.interestRate}
          loanTermMonths={client.loanTermMonths}
        />
      )}

      {/* Loan Scenario Analysis */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Loan Scenario Analysis</Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Scenario Loan Amount"
              value={scenarioLoanAmount}
              onChange={(e) => setScenarioLoanAmount(parseFloat(e.target.value))}
              InputProps={{ startAdornment: <DollarSign size={16} /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Scenario Interest Rate (%)"
              value={scenarioInterestRate}
              onChange={(e) => setScenarioInterestRate(parseFloat(e.target.value))}
              inputProps={{ step: '0.01' }}
              InputProps={{ startAdornment: <Percent size={16} /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Scenario Loan Term (Months)"
              value={scenarioLoanTermMonths}
              onChange={(e) => setScenarioLoanTermMonths(parseFloat(e.target.value))}
              InputProps={{ startAdornment: <Clock size={16} /> }}
            />
          </Grid>
        </Grid>

        {scenarioLoanAmount > 0 && scenarioLoanTermMonths > 0 && scenarioInterestRate >= 0 ? (
          <Paper variant="outlined" sx={{ mt: 4, p: 3, bgcolor: 'success.50' }}>
            <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>Scenario Results</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><InfoRow icon={<DollarSign size={20} />} label="Monthly Payment" value={formatINR(scenarioCalc.monthlyPayment)} /></Grid>
              <Grid item xs={12} md={4}><InfoRow icon={<DollarSign size={20} />} label="Total Interest Paid" value={formatINR(scenarioCalc.totalInterest)} /></Grid>
              <Grid item xs={12} md={4}><InfoRow icon={<DollarSign size={20} />} label="Total Amount Paid" value={formatINR(scenarioCalc.totalAmount)} /></Grid>
            </Grid>
            <Box textAlign="center" mt={3}>
              <Button variant="outlined" color="inherit" onClick={resetScenario}>Reset Scenario</Button>
            </Box>
          </Paper>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            Adjust scenario parameters above to see results.
          </Typography>
        )}
      </Paper>

      <Button variant="outlined" color="inherit" onClick={handleBack}>Back to Clients</Button>
    </Box>
  );
};

export default ClientDetail;