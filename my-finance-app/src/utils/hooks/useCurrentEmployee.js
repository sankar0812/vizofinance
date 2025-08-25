// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../pages/auth/AuthContext';

// const API_BASE = import.meta.env.VITE_APP_BASE_URL;

// export const useCurrentEmployee = (options = {}) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { token } = useAuth();

//   useEffect(() => {
//     if (options.enabled === false) return;

//     const fetchEmployee = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(`${API_BASE}/api/employees/dashboard`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const employee = res.data;
//         const clients = employee.clients || [];

//         let totalPaid = 0;
//         let totalDue = 0;

//         clients.forEach((client) => {
//           (client.paymentHistory || []).forEach((payment) => {
//             totalPaid += payment.amountPaid || 0;
//             totalDue += payment.remainingBalance || 0;
            
//           });
//         });

//         setData({
//           employee,
//           assignclient: clients.length,
//           totalPaid,
//           totalDue,
//         });
//       } catch (err) {
//         console.error('Error fetching employee dashboard:', err);
//         setError(err.message || 'Failed to fetch employee data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployee();
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

export const useCurrentEmployee = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (options.enabled === false) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE}/api/employees/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const employee = res.data;

        // ✅ Assigned clients are under employee.clients
        const assignedClients = employee.clients || [];

        let totalPaid = 0;
        let totalDue = 0;

        assignedClients.forEach((client) => {
          const payments = Array.isArray(client.paymentHistory)
            ? [...client.paymentHistory].sort(
                (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate)
              )
            : [];

          // totals per client
          const { totalPaid: clientPaid, totalPrincipal } = payments.reduce(
            (acc, p) => {
              acc.totalPaid += Number(p.amountPaid ?? 0);
              acc.totalPrincipal += Number(p.principalPaid ?? 0);
              return acc;
            },
            { totalPaid: 0, totalPrincipal: 0 }
          );

          totalPaid += clientPaid;

          // totalDue per client (same logic as useCurrentClient)
          const latestRemainingFromPayments =
            payments.length
              ? Number(payments[payments.length - 1].remainingBalance ?? NaN)
              : NaN;

          const clientDue =
            Number(client.currentOutstandingLoanAmount ?? NaN) ||
            (Number.isFinite(latestRemainingFromPayments)
              ? latestRemainingFromPayments
              : null) ||
            Math.max(0, Number(client.loanAmount ?? 0) - totalPrincipal);

          totalDue += clientDue;
        });

        setData({
          employee,
          assignclient: assignedClients.length,
          totalPaid,
          totalDue,
        });
      } catch (err) {
        console.error('Error fetching employee dashboard:', err);
        setError(err.message || 'Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [options.enabled, token]);

  return { data, loading, error };
};
