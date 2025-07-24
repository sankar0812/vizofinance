import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatINR } from '../utils/currency';

const LoanAmortization = ({ loanAmount, annualInterestRate, loanTermMonths }) => {
  const [amortizationData, setAmortizationData] = useState([]);

  useEffect(() => {
    const calculateAmortization = () => {
      if (loanAmount <= 0 || annualInterestRate < 0 || loanTermMonths <= 0) {
        setAmortizationData([]);
        return;
      }

      const monthlyInterestRate = (annualInterestRate / 100) / 12;
      let monthlyPayment;

      if (monthlyInterestRate === 0) {
        monthlyPayment = loanAmount / loanTermMonths;
      } else {
        monthlyPayment =
          (loanAmount * monthlyInterestRate) /
          (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
      }

      let currentBalance = loanAmount;
      const data = [];

      for (let i = 1; i <= loanTermMonths; i++) {
        const interestPayment = currentBalance * monthlyInterestRate;
        let principalPayment = monthlyPayment - interestPayment;

        if (i === loanTermMonths) {
          principalPayment = currentBalance;
          monthlyPayment = principalPayment + interestPayment;
        }

        currentBalance -= principalPayment;
        if (currentBalance < 0) currentBalance = 0;

        data.push({
          month: i,
          startingBalance: parseFloat((currentBalance + principalPayment).toFixed(2)),
          monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
          principalPaid: parseFloat(principalPayment.toFixed(2)),
          interestPaid: parseFloat(interestPayment.toFixed(2)),
          endingBalance: parseFloat(currentBalance.toFixed(2)),
        });
      }
      setAmortizationData(data);
    };

    calculateAmortization();
  }, [loanAmount, annualInterestRate, loanTermMonths]);

  if (amortizationData.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Please enter valid Loan Amount, Interest Rate, and Loan Term to view the amortization schedule.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom borderBottom={1} pb={1}>
        Amortization Schedule
      </Typography>

      {/* Chart */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Principal vs. Interest Over Time
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={amortizationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: 0 }} />
              <YAxis
                tickFormatter={(value) => formatINR(value)}
                label={{ value: "Amount", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${formatINR(value)}`, name]}
              />
              <Legend />
              <Area type="monotone" dataKey="principalPaid" stackId="1" stroke="#8884d8" fill="#8884d8" name="Principal Paid" />
              <Area type="monotone" dataKey="interestPaid" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Interest Paid" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Table */}
      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
        Detailed Breakdown
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Starting Balance</TableCell>
              <TableCell>Monthly Payment</TableCell>
              <TableCell>Principal Paid</TableCell>
              <TableCell>Interest Paid</TableCell>
              <TableCell>Ending Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {amortizationData.map((row) => (
              <TableRow key={row.month} hover>
                <TableCell>{row.month}</TableCell>
                <TableCell>{formatINR(row.startingBalance)}</TableCell>
                <TableCell>{formatINR(row.monthlyPayment)}</TableCell>
                <TableCell>{formatINR(row.principalPaid)}</TableCell>
                <TableCell>{formatINR(row.interestPaid)}</TableCell>
                <TableCell>{formatINR(row.endingBalance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default LoanAmortization;