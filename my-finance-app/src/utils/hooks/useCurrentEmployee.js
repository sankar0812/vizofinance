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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const employee = res.data;
        const clients = employee.clients || [];

        let totalPaid = 0;
        let totalDue = 0;

        clients.forEach((client) => {
          (client.paymentHistory || []).forEach((payment) => {
            totalPaid += payment.amountPaid || 0;
            totalDue += payment.remainingBalance || 0;
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