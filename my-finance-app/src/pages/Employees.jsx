import React, { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthContext';
import EmployeeFormDialog from './EmployeeFormDialog';
import {
  Button,
  Typography,
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Employees = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinedDate: null,
    password: '',
    role: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const { token } = useAuth() || {};
  const API_BASE = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeData(employee);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const openDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(`${API_BASE}/api/employees/${employeeToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Employee deleted successfully!');
      fetchEmployees();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('❌ Failed to delete employee.');
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${API_BASE}/api/employees/${selectedEmployee.id}`
        : `${API_BASE}/api/employees`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const successMsg = isEditing ? 'Employee updated successfully!' : 'Employee added successfully!';
        toast.success(successMsg);
        fetchEmployees();
        setOpenDialog(false);
        setSelectedEmployee(null);
        setIsEditing(false);
        setEmployeeData({
          name: '',
          email: '',
          phone: '',
          address: '',
          joinedDate: null,
          password: '',
          role: '',
        });
        setMessage('');
      } else {
        const err = await response.json();
        setMessage(`❌ ${err.message || 'Operation failed.'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('❌ Server error.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom className="my-4">
        Employee Management
      </Typography>

      {message && <Typography color="error">{message}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEmployeeData({
            name: '',
            email: '',
            phone: '',
            address: '',
            joinedDate: null,
            password: '',
            role: '',
          });
          setIsEditing(false);
          setOpenDialog(true);
        }}
        style={{ marginBottom: '1rem' }}
      >
        Add Employee
      </Button>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <TableRow key={emp._id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.address}</TableCell>
                  <TableCell>{emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEdit(emp)}>
                        <Edit2 size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => openDeleteDialog(emp)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No employees added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Employee Form Dialog */}
      <EmployeeFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        employee={employeeData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          Are you sure you want to delete{' '}
          <strong>{employeeToDelete?.name}</strong>?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Employees;
