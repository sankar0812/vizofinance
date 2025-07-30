// import React, { useState, useEffect } from 'react';
// import { useAuth } from './auth/AuthContext';
// import EmployeeFormDialog from './EmployeeFormDialog'; // make sure the path is correct
// import { Button, Typography, Container, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// import { IconButton, Tooltip } from '@mui/material';
// import { Edit2, Trash2 } from 'lucide-react';



// const Employees = () => {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [showDialog, setShowDialog] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const { token } = useAuth() || {};
//   const API_BASE = import.meta.env.VITE_APP_BASE_URL;


//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const [employeeData, setEmployeeData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     joinedDate: null,
//     password: '',
//     role: '',
//   });

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/employees`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch employees');
//       const data = await response.json();
//       setEmployees(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   // const handleEmployeeAdded = () => {
//   //   fetchEmployees(); // refresh list
//   //   setShowDialog(false); // close dialog
//   //   setMessage('✅ Employee added successfully!');
//   //   setMessageType('success');
//   //   setTimeout(() => setMessage(''), 3000);
//   // };


//   const handleEdit = (employee) => {
//     setSelectedEmployee(employee);
//     setEmployeeData(employee);
//     setIsEditing(true);
//     setOpenDialog(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       try {
//         await axios.delete(`${API_BASE}/api/employees/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchEmployees();
//         setMessage('✅ Employee deleted.');
//         setTimeout(() => setMessage(''), 3000);
//       } catch (error) {
//         console.error('Delete error:', error);
//         setMessage('❌ Failed to delete employee.');
//       }
//     }
//   };




//   const handleEmployeeAdded = () => {
//     fetchEmployees(); // reload
//     setOpenDialog(false); // close dialog
//     setShowDialog(false);
//     setMessage('✅ Employee added successfully!');
//     setTimeout(() => setMessage(''), 3000);
//   };


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmployeeData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const response = await fetch(`${API_BASE}/api/employees`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify(employeeData),
//   //     });

//   //     if (response.ok) {
//   //       setMessage('✅ Employee added successfully!');
//   //       setEmployees({
//   //         name: '',
//   //         email: '',
//   //         phone: '',
//   //         address: '',
//   //         joinedDate: '',
//   //         role: 'EMPLOYEE',
//   //         password: '',
//   //       });
//   //       fetchEmployees();
//   //       setShowForm(false);

//   //       if (typeof onSuccess === 'function') {
//   //         onSuccess();
//   //       }
//   //     } else {
//   //       const err = await response.json();
//   //       setMessage(`❌ ${err.message || 'Failed to add employee'}`);
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //     setMessage('❌ Server error occurred.');
//   //   }
//   // };

//     const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = isEditing
//         ? `${API_BASE}/api/employees/${selectedEmployee._id}`
//         : `${API_BASE}/api/employees`;

//       const method = isEditing ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(employeeData),
//       });

//       if (response.ok) {
//         setMessage(isEditing ? '✅ Employee updated.' : '✅ Employee added.');
//         fetchEmployees();
//         setOpenDialog(false);
//         setSelectedEmployee(null);
//         setIsEditing(false);
//         setEmployeeData({
//           name: '',
//           email: '',
//           phone: '',
//           address: '',
//           joinedDate: null,
//           password: '',
//           role: '',
//         });
//         setTimeout(() => setMessage(''), 3000);
//       } else {
//         const err = await response.json();
//         setMessage(`❌ ${err.message || 'Operation failed.'}`);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       setMessage('❌ Server error.');
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom className="my-4">
//         Employee Management
//       </Typography>

//       {/* Add Employee Button */}
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => setOpenDialog(true)}
//         style={{ marginBottom: '1rem' }}
//       >
//         Add Employee
//       </Button>

//       {/* Employee Table */}
//       <Paper elevation={2}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Phone</TableCell>
//               <TableCell>Address</TableCell>
//               <TableCell>Joined Date</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {employees.length > 0 ? (
//               employees.map((emp, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{emp.name}</TableCell>
//                   <TableCell>{emp.email}</TableCell>
//                   <TableCell>{emp.phone}</TableCell>
//                   <TableCell>{emp.address}</TableCell>
//                   <TableCell>{emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : ''}</TableCell>
//                   <TableCell>{emp.role}</TableCell>
//                   <TableCell align="center">
//                     <Tooltip title="Edit">
//                       <IconButton color="primary" onClick={() => handleEdit(employees)}>
//                         <Edit2 size={16} />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <IconButton color="error" onClick={() => handleDelete(employees._id)}>
//                         <Trash2 size={16} />
//                       </IconButton>
//                     </Tooltip>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   No employees added yet.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </Paper>

//       {/* Employee Dialog */}
//       <EmployeeFormDialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         employee={employeeData}
//         onChange={handleInputChange}
//         onSubmit={handleSubmit}
//         onSuccess={handleEmployeeAdded}
//         isEditing={isEditing}
//       />
//     </Container>
//   );
// };

// export default Employees;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Employee Management</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           onClick={() => setShowDialog(true)}
//         >
//           ➕ Add Employee
//         </button>
//       </div>

//       {message && (
//         <p className={`text-sm mb-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//           {message}
//         </p>
//       )}

//       {/* Reusable Dialog Component */}
//       {showDialog && (
//         <EmployeeFormDialog
//           token={token}
//           onClose={() => setShowDialog(false)}
//           onSuccess={handleEmployeeAdded}
//         />
//       )}

//       {/* Table */}
//       <h2 className="text-xl font-semibold mb-4">Employee List</h2>
//       {employees.length === 0 ? (
//         <p className="text-gray-500">No employees found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 text-sm bg-white">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2">Name</th>
//                 <th className="border px-4 py-2">Email</th>
//                 <th className="border px-4 py-2">Phone</th>
//                 <th className="border px-4 py-2">Joined Date</th>
//                 <th className="border px-4 py-2">Role</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((emp, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border px-4 py-2">{emp.name}</td>
//                   <td className="border px-4 py-2">{emp.email}</td>
//                   <td className="border px-4 py-2">{emp.phone}</td>
//                   <td className="border px-4 py-2">
//                     {new Date(emp.joinedDate).toLocaleDateString()}
//                   </td>
//                   <td className="border px-4 py-2">{emp.role}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Employees;



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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_BASE}/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Employee deleted successfully!');
        fetchEmployees();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Delete error:', error);
        setMessage('❌ Failed to delete employee.');
      }
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
        setTimeout(() => setMessage(''), 3000);
      } else {
        const err = await response.json();
        setMessage(`❌ ${err.message || 'Operation failed.'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('❌ Server error.');
    }
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
                      <IconButton color="error" onClick={() => handleDelete(emp.id)}>
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
    </Container>
  );
};

export default Employees;
