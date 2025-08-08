// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import { useAuth } from '../../pages/auth/AuthContext';

// export const useCurrentClient = () => {
// const { token, user } = useAuth() || {}
//   return useQuery({
//     queryKey: ['current-client'],
//     queryFn: async () => {
//       // const res = await axios.get('/api/clients/me', {
//       //   headers: {
//       //     Authorization: `Bearer ${token}`,
//       //     'Cache-Control': 'no-cache',
//       //   },
//       // });
//       // return res.data;
//     },
//     staleTime: 0,
//     cacheTime: 0,
//     enabled: !!token, // only fetch if token exists
//   });
// };


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
        const loanPayments = client.loanPayments || [];

        if (loanPayments.length === 0) {
          setData({
            client,
            totalPaid: 0,
            totalDue: 0,
          });
          return;
        }

        let totalPaid = 0;
        let totalDue = 0;

        loanPayments.forEach((payment) => {
          if (payment.status === 'PAID') {
            totalPaid += payment.amountPaid || 0;
          } else if (payment.status === 'DUE') {
            totalDue += payment.amountPaid || 0;
          }
        });

        setData({
          client,
          totalPaid,
          totalDue,
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
