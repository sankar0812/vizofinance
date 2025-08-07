import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../pages/auth/AuthContext';

const API_BASE = import.meta.env.VITE_APP_BASE_URL;

export const useCurrentEmployee = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // moved outside to avoid re-evaluation

  useEffect(() => {
    if (options.enabled === false) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE}/api/employees/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const employee = res.data;

        const clients = employee.clients || [];

        if (clients.length === 0) {
          setData({
            employee,
            assignclient: 0,
            totalPaid: 0,
            totalDue: 0,
          });
          return;
        }

        let totalPaid = 0;
        let totalDue = 0;

        clients.forEach((client) => {
          (client.paymentHistory || []).forEach((payment) => {
            if (payment.status === 'PAID') {
              totalPaid += payment.amountPaid || 0;
            } else if (payment.status === 'DUE') {
              totalDue += payment.amountPaid || 0;
            }
          });
        });

        setData({
          employee,
          assignclient: clients.length,
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

  return {
    data,
    loading,
    error,
  };
};