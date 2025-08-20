// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../pages/auth/AuthContext';

// const API_BASE = import.meta.env.VITE_APP_BASE_URL;

// export const useCurrentClient = (options = {}) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { token } = useAuth();

//   useEffect(() => {
//     if (options.enabled === false) return;

//     const fetchClient = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(
//           `${API_BASE}/api/clients/client/dashboard`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const client = res.data;
//         const payments = client.paymentHistory || [];

//         if (payments.length === 0) {
//           setData({
//             ...client,
//             totalPaid: 0,
//             totalDue: 0,
//             totalInterest: 0,
//           });
//           return;
//         }

//         let totalPaid = 0;
//         let totalDue = 0;
//         let totalInterest = 0;

//         payments.forEach((p) => {
//           totalPaid += p.amountPaid || 0;
//           totalDue += p.remainingBalance || 0;
//           totalInterest += p.interestPaid || 0;
//         });

//         setData({
//           ...client,      // flatten client fields (loanAmount, name, etc.)
//           totalPaid,
//           totalDue,
//           totalInterest,
//         });
//       } catch (err) {
//         console.error('Error fetching client dashboard:', err);
//         setError(err.message || 'Failed to fetch client data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClient();
//   }, [options.enabled, token]);

//   return {
//     data,
//     loading,
//     error,
//   };
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

        const res = await axios.get(`${API_BASE}/api/clients/client/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const client = res.data ?? {};
        const payments = Array.isArray(client.paymentHistory) ? [...client.paymentHistory] : [];

        // Sort by payment date ascending so the last one is the latest
        payments.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));

        // Totals
        const { totalPaid, totalInterest, totalPrincipal } = payments.reduce(
          (acc, p) => {
            acc.totalPaid += Number(p.amountPaid ?? 0);
            acc.totalInterest += Number(p.interestPaid ?? 0);
            acc.totalPrincipal += Number(p.principalPaid ?? 0);
            return acc;
          },
          { totalPaid: 0, totalInterest: 0, totalPrincipal: 0 }
        );

        // Never sum remainingBalance. Use API outstanding first, then latest payment, then compute.
        const latestRemainingFromPayments =
          payments.length ? Number(payments[payments.length - 1].remainingBalance ?? NaN) : NaN;

        const totalDue =
          Number(client.currentOutstandingLoanAmount ?? NaN) ||
          (Number.isFinite(latestRemainingFromPayments) ? latestRemainingFromPayments : null) ||
          Math.max(0, Number(client.loanAmount ?? 0) - totalPrincipal);

        setData({
          ...client,
          paymentHistory: payments,
          totalPaid,
          totalInterest,
          totalPrincipal,
          totalDue,
        });
      } catch (err) {
        console.error('Error fetching client dashboard:', err);
        setError(err?.message || 'Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [options.enabled, token]);

  return { data, loading, error };
};
