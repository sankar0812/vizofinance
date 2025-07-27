import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Paper,
} from '@mui/material';
import { formatINR } from '../utils/currency';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { useAuth } from './auth/AuthContext';
import { motion } from 'framer-motion';

export default function ClientPaymentHistory() {
  const { clientId } = useParams();
  const { token } = useAuth() || {};
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch client data');
        const data = await response.json();
        setClient(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [clientId]);

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!client) return <Typography>No client data found.</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color="text.primary"
        sx={{ mb: 0, pb: 2 }}
      >
        Payment History for {client.name}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {Array.isArray(client.paymentHistory) && client.paymentHistory.length > 0 ? (
        <Timeline position="alternate">
          {[...client.paymentHistory]
            .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
            .map((p, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  {index < client.paymentHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper elevation={3} sx={{ p: 2 }}>
                      <Typography variant="subtitle1">
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Amount Paid: {formatINR(p.amountPaid)}
                      </Typography>
                      <Typography variant="body2">
                        Principal: {formatINR(p.principalPaid)}
                      </Typography>
                      <Typography variant="body2">
                        Interest: {formatINR(p.interestPaid)}
                      </Typography>
                    </Paper>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      ) : (
        <Typography>No payments made yet.</Typography>
      )}
    </Container>
  );
}