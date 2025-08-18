import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../pages/auth/AuthContext';

const API_BASE = import.meta.env.VITE_APP_BASE_URL;

export const useCurrentClient = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (options.enabled === false) return;

    const fetchClient = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_BASE}/api/clients/client/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const client = res.data;
        const payments = client.paymentHistory || [];

        if (payments.length === 0) {
          setData({
            ...client,
            totalPaid: 0,
            totalDue: 0,
            totalInterest: 0,
          });
          return;
        }

        let totalPaid = 0;
        let totalDue = 0;
        let totalInterest = 0;

        payments.forEach((p) => {
          totalPaid += p.amountPaid || 0;
          totalDue += p.remainingBalance || 0;
          totalInterest += p.interestPaid || 0;
        });

        setData({
          ...client,      // flatten client fields (loanAmount, name, etc.)
          totalPaid,
          totalDue,
          totalInterest,
        });
      } catch (err) {
        console.error('Error fetching client dashboard:', err);
        setError(err.message || 'Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [options.enabled, token]);

  return {
    data,
    loading,
    error,
  };
};