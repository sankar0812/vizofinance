import React, { useState } from 'react';
import { Typography, Grid, Paper, Divider, Box, Button } from '@mui/material';
import { DollarSign, Percent, Clock, Calculator } from 'lucide-react';
import LoanAmortization from './LoanAmortization.jsx';

const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

const InfoRow = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" gap={1} mb={1}>
    {icon}
    <Typography variant="body2" fontWeight={600}>
      {label}:
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {value}
    </Typography>
  </Box>
);

export default function MyPayment({ client, baseCalc, scenarioCalc, scenarioLoanAmount, scenarioInterestRate, scenarioLoanTermMonths, setScenarioLoanAmount, setScenarioInterestRate, setScenarioLoanTermMonths, resetScenario, clearScenario }) {
  const [showAmortization, setShowAmortization] = useState(false);

  return (
    <>
      {/* Loan Details & Calculation */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Loan Details & Calculation
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <InfoRow
              icon={<DollarSign size={20} color="#22c55e" />}
              label="Loan Amount"
              value={formatINR(client.loanAmount)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoRow
              icon={<Percent size={20} color="#22c55e" />}
              label="Interest Rate (Annual)"
              value={`${client.interestRate}%`}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoRow
              icon={<Clock size={20} color="#22c55e" />}
              label="Loan Term (Months)"
              value={client.loanTermMonths}
            />
          </Grid>
        </Grid>

        {client.loanAmount > 0 && client.loanTermMonths > 0 && client.interestRate >= 0 ? (
          <Paper variant="outlined" sx={{ mt: 4, p: 2, bgcolor: 'primary.50' }}>
            <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
              Calculated Loan Payments
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoRow icon={<DollarSign size={20} />} label="Monthly Payment" value={formatINR(baseCalc.monthlyPayment)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow icon={<DollarSign size={20} />} label="Total Interest Paid" value={formatINR(baseCalc.totalInterest)} />
              </Grid>
              <Grid item xs={12}>
                <InfoRow icon={<DollarSign size={20} />} label="Total Amount Paid" value={formatINR(baseCalc.totalAmount)} />
              </Grid>
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
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Loan Scenario Analysis
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <label className="form-label">Scenario Loan Amount</label>
            <input
              type="number"
              className="form-control"
              value={scenarioLoanAmount}
              onChange={(e) => setScenarioLoanAmount(parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="form-label">Scenario Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={scenarioInterestRate}
              onChange={(e) => setScenarioInterestRate(parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <label className="form-label">Scenario Loan Term (Months)</label>
            <input
              type="number"
              className="form-control"
              value={scenarioLoanTermMonths}
              onChange={(e) => setScenarioLoanTermMonths(parseFloat(e.target.value))}
            />
          </Grid>
        </Grid>

        {scenarioLoanAmount > 0 && scenarioLoanTermMonths > 0 && scenarioInterestRate >= 0 ? (
          <Paper variant="outlined" sx={{ mt: 4, p: 2, bgcolor: 'success.50' }}>
            <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>
              Scenario Results
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoRow icon={<DollarSign size={20} />} label="Monthly Payment" value={formatINR(scenarioCalc.monthlyPayment)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow icon={<DollarSign size={20} />} label="Total Interest Paid" value={formatINR(scenarioCalc.totalInterest)} />
              </Grid>
              <Grid item xs={12}>
                <InfoRow icon={<DollarSign size={20} />} label="Total Amount Paid" value={formatINR(scenarioCalc.totalAmount)} />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" color="secondary" onClick={resetScenario}>
                Reset Scenario
              </Button>
              <Button variant="outlined" color="error" onClick={clearScenario}>
                Clear
              </Button>
            </Box>
          </Paper>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            Adjust scenario parameters above to see results.
          </Typography>
        )}
      </Paper>
    </>
  );
}
