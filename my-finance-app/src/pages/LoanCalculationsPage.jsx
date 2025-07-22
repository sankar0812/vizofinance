import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DollarSign, PlusCircle, Search as SearchIcon, XCircle } from 'lucide-react';
import { useClients } from '../utils/hooks/useClients';
import { formatINR } from '../utils/currency';

const API_BASE_URL = 'http://localhost:5000/api/clients';

export default function LoanCalculationsPage({ customConfirm }) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: clients, loading, error, refetch } = useClients();

  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredClients = useMemo(() => {
    if (!Array.isArray(clients) || !normalizedSearch) return clients || [];
    return clients.filter((c) => {
      const name = (c?.name ?? '').toString().toLowerCase();
      if (name.includes(normalizedSearch)) return true;

      const s = normalizedSearch.replace(/[^0-9.]/g, '');
      if (!s) return false;
      const loanAmt = String(c?.loanAmount ?? '');
      const outstanding = String(c?.currentOutstandingLoanAmount ?? '');
      const rate = String(c?.interestRate ?? '');
      return loanAmt.includes(s) || outstanding.includes(s) || rate.includes(s);
    });
  }, [clients, normalizedSearch]);

  // --- Record payment modal state ----------------------------------------
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentError, setPaymentError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [includeInterest, setIncludeInterest] = useState(false);

  const openRecordPaymentModal = (client) => {
    setSelectedClientForPayment(client);
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentError('');
    setIncludeInterest(false);
    setShowRecordPaymentModal(true);
  };

  const closeRecordPaymentModal = () => {
    setShowRecordPaymentModal(false);
    setSelectedClientForPayment(null);
    setSubmitting(false);
    setIncludeInterest(false);
  };

  const handleIncludeInterestChange = (checked) => {
    setIncludeInterest(checked);
    if (checked && selectedClientForPayment) {
      // Calculate interest only based on original loan amount
      const loanAmount = selectedClientForPayment.loanAmount || 0;
      const interestRate = selectedClientForPayment.interestRate || 0;
      const interest = (loanAmount * interestRate) / 100;
      setPaymentAmount(interest.toFixed(2));
    } else {
      setPaymentAmount('');
    }
  };

  const handleRecordPayment = async () => {
    setPaymentError('');

    const amt = parseFloat(paymentAmount);
    if (!paymentAmount || Number.isNaN(amt) || amt <= 0) {
      setPaymentError('Please enter a valid payment amount.');
      return;
    }
    if (!selectedClientForPayment) {
      setPaymentError('No client selected for payment.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/${selectedClientForPayment.id}/record-payment`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountPaid: amt,
            paymentDate,
            includeInterest,
          }),
        }
      );

      if (!response.ok) {
        let msg = 'Failed to record payment.';
        try {
          const errorData = await response.json();
          if (errorData?.message) msg = errorData.message;
        } catch (_) {}
        throw new Error(msg);
      }

      await refetch();
      closeRecordPaymentModal();
      customConfirm?.('Payment recorded successfully!');
    } catch (error) {
      console.error('Error recording payment:', error);
      const msg = error?.message || 'Error recording payment. Please try again.';
      customConfirm?.(msg);
      setPaymentError(msg);
      setSubmitting(false);
    }
  };

  // --- Loading / error states --------------------------------------------
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        Failed to load clients. Please try again.
      </Alert>
    );
  }

  // --- Render -------------------------------------------------------------
  return (
    <Container
     sx={{ width: '100%', pb: 6 }}
    >
      <Typography
        variant={'h4'}
        fontWeight={700}
        color="text.primary"
        sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        Manage Loan Payments
      </Typography>

      {/* Search Bar */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <TextField
          fullWidth
          label="Search clients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, amount, or rate"
          size={'small'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={16} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  edge="end"
                  size="small"
                  onClick={() => setSearchTerm('')}
                >
                  <XCircle size={16} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {filteredClients && filteredClients.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            pb: 2,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          {filteredClients.map((client) => {
            const paymentsMade = client?.paymentHistory?.length || 0;
            const loanAmt = client?.loanAmount || 0;
            const outstanding = client?.currentOutstandingLoanAmount || 0;
            const disabled = outstanding <= 0;

            return (
              <Card
                key={client.id}
                sx={{
                  flex: '0 0 350px',
                  width: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                variant="outlined"
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {client.name}
                  </Typography>
                  <Stack spacing={0.75} sx={{ fontSize: '0.95rem' }}>
                    <ClientLoanLine icon={<DollarSign size={16} />} label="Original Loan" value={formatINR(loanAmt)} />
                    <ClientLoanLine icon={<DollarSign size={16} />} label="Outstanding" value={formatINR(outstanding)} />
                    <ClientLoanLine icon={<DollarSign size={16} />} label="Interest Rate" value={`${client?.interestRate || 0}%`} />
                    <ClientLoanLine icon={<DollarSign size={16} />} label="Loan Term" value={`${client?.loanTermMonths || 0} months`} />
                    <ClientLoanLine icon={<DollarSign size={16} />} label="Payments Made" value={paymentsMade} />
                  </Stack>
                </CardContent>
                <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
                  <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<PlusCircle size={18} />}
                    disabled={disabled}
                    onClick={() => openRecordPaymentModal(client)}
                  >
                    Record Payment
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Typography align="center" color="text.secondary" sx={{ pt: 5 }}>
          {searchTerm ? 'No matching clients.' : 'No clients with loan details found.'}
        </Typography>
      )}

      {/* Record Payment Modal */}
      <Dialog
        open={showRecordPaymentModal && Boolean(selectedClientForPayment)}
        onClose={closeRecordPaymentModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Record Payment for {selectedClientForPayment?.name ?? ''}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Amount Paid (INR)"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="e.g., 5000"
              fullWidth
              required
              autoFocus
              inputProps={{ min: 0, step: 'any' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeInterest}
                  onChange={(e) => handleIncludeInterestChange(e.target.checked)}
                />
              }
              label="Include Interest"
            />
            <TextField
              label="Payment Date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            {paymentError && (
              <Alert severity="error" variant="filled">
                {paymentError}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRecordPaymentModal} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleRecordPayment}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

LoanCalculationsPage.propTypes = {
  customConfirm: PropTypes.func,
};

LoanCalculationsPage.defaultProps = {
  customConfirm: (msg) => window.alert(msg),
};

function ClientLoanLine({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography variant="body2" color="text.secondary" component="span">
        {label}:
      </Typography>
      <Typography variant="body2" component="span" color="text.primary" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  );
}

ClientLoanLine.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};