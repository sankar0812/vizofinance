import React, { useEffect, useState } from 'react';
import {
  Box, Typography, MenuItem, Select, Button, Stack,
  CircularProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { useClients } from '../utils/hooks/useClients';
import { useAuth } from './auth/AuthContext';

const AssignClients = () => {
  const { token } = useAuth();
  const { data: clients, refetch } = useClients();
  const [employees, setEmployees] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };

    fetchEmployees();
  }, [token]);

  const handleAssign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/clients/${selectedClientId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: selectedEmployeeId }),
      });

      if (res.ok) {
        await refetch();
        alert('Client assigned successfully!');
        setSelectedClientId('');
        setSelectedEmployeeId('');
      } else {
        const error = await res.json();
        alert(`Failed to assign client: ${error.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Assign error', err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} color="text.primary" mb={3}>Assign Clients to Employees</Typography>

      <Stack spacing={3} width="100%">
        <Select
          fullWidth
          size='small'
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Select Client</MenuItem>
          {clients
            .filter(client => !client.assignedTo)
            .map(client => (
              <MenuItem key={client.id} value={client.id}>
                {client.name} ({client.email})
              </MenuItem>
            ))}
        </Select>

        <Select
          fullWidth
          size='small'
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Select Employee</MenuItem>
          {employees?.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>{emp.email}</MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          disabled={!selectedClientId || !selectedEmployeeId || loading}
          onClick={handleAssign}
        >
          {loading ? <CircularProgress size={24} /> : 'Assign'}
        </Button>
      </Stack>

      {clients.filter(c => c.assignedTo).length > 0 && (
        <>
          <Typography variant="h5" fontWeight={400} color="text.primary" mt={5} mb={2}>
            Assigned Clients
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Client Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Assigned To (Employee)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients
                  .filter(client => client.assignedTo)
                  .map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.employee?.email + '(' + '' || 'Unknown'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default AssignClients;