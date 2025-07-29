// import React, { useState, useEffect } from 'react';
// import { useAuth } from './auth/AuthContext';
// import EmployeeFormDialog from './EmployeeFormDialog';

// const Employees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [message, setMessage] = useState('');

//   const [employee, setEmployee] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     joinedDate: '',
//     role: 'EMPLOYEE',
//     password: '',
//   });

//   const { token } = useAuth() || {};
//   const API_BASE = import.meta.env.VITE_APP_BASE_URL;

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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEmployee({ ...employee, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_BASE}/api/employees`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(employee),
//       });

//       if (response.ok) {
//         setMessage('✅ Employee added successfully!');
//         setEmployee({
//           name: '',
//           email: '',
//           phone: '',
//           address: '',
//           joinedDate: '',
//           role: 'EMPLOYEE',
//           password: '',
//         });
//         fetchEmployees();
//         setShowForm(false);
//       } else {
//         const err = await response.json();
//         setMessage(`❌ ${err.message || 'Failed to add employee'}`);
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage('❌ Server error occurred.');
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Heading + Add button */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Employee Management</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={() => setShowForm(!showForm)}
//         >
//           {showForm ? 'Close Form' : '➕ Add New Employee'}
//         </button>
//       </div>

//       {/* Show message */}
//       {message && <p className="text-sm mb-4 text-green-600">{message}</p>}

//       {/* Form to Add Employee */}
//       {showForm && (
//         <form
//           onSubmit={handleSubmit}
//           className="mb-8 p-6 border border-gray-300 rounded-md bg-white shadow-md grid grid-cols-2 gap-4 max-w-3xl"
//         >
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={employee.name}
//             onChange={handleChange}
//             className="border px-3 py-2 rounded"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={employee.email}
//             onChange={handleChange}
//             className="border px-3 py-2 rounded"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             value={employee.phone}
//             onChange={handleChange}
//             className="border px-3 py-2 rounded"
//             required
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={employee.address}
//             onChange={handleChange}
//             className="border px-3 py-2 rounded"
//           />
//           <input
//             type="date"
//             name="joinedDate"
//             value={employee.joinedDate}
//             onChange={handleChange}
//             className="border px-3 py-2 rounded"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={employee.password}
//             onChange={handleChange}
//             className="border px-3 py-2 rounded"
//           />
//           <div className="col-span-2 text-right">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//             >
//               Save Employee
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Employee Table */}
//       <h2 className="text-xl font-semibold mb-4">Employee List</h2>
//       {employees.length === 0 ? (
//         <p>No employees found.</p>
//       ) : (
//         <table className="min-w-full border border-gray-300 text-sm bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-4 py-2">Name</th>
//               <th className="border px-4 py-2">Email</th>
//               <th className="border px-4 py-2">Phone</th>
//               <th className="border px-4 py-2">Joined Date</th>
//               <th className="border px-4 py-2">Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.map((emp, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="border px-4 py-2">{emp.name}</td>
//                 <td className="border px-4 py-2">{emp.email}</td>
//                 <td className="border px-4 py-2">{emp.phone}</td>
//                 <td className="border px-4 py-2">
//                   {new Date(emp.joinedDate).toLocaleDateString()}
//                 </td>
//                 <td className="border px-4 py-2">{emp.role}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Employees;


import React, { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthContext';
import EmployeeFormDialog from './EmployeeFormDialog'; // make sure the path is correct
import { Button, Typography, Container, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';



const Employees = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { token } = useAuth() || {};
  const API_BASE = import.meta.env.VITE_APP_BASE_URL;

    const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinedDate: null,
    password: '',
    role: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEmployeeAdded = () => {
    fetchEmployees(); // refresh list
    setShowDialog(false); // close dialog
    setMessage('✅ Employee added successfully!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

// const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setEmployees((prev) => [...prev, employeeData]);
//     setEmployeeData({
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       joinedDate: null,
//       password: '',
//       role: '',
//     });
//     setOpenDialog(false);
//   };


// const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEmployees({ ...employee, [name]: value });
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(employees),
      });

      if (response.ok) {
        setMessage('✅ Employee added successfully!');
        setEmployees({
          name: '',
          email: '',
          phone: '',
          address: '',
          joinedDate: '',
          role: 'EMPLOYEE',
          password: '',
        });
        fetchEmployees();
        setShowForm(false);
      } else {
        const err = await response.json();
        setMessage(`❌ ${err.message || 'Failed to add employee'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Server error occurred.');
    }
  };

return (
    <Container>
      <Typography variant="h4" gutterBottom className="my-4">
        Employee Management
      </Typography>

      {/* Add Employee Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '1rem' }}
      >
        Add Employee
      </Button>

      {/* Employee Table */}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((emp, index) => (
                <TableRow key={index}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.address}</TableCell>
                  <TableCell>{emp.joinedDate ? new Date(emp.joinedDate).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No employees added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Employee Dialog */}
      <EmployeeFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        employee={employeeData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onSuccess={handleEmployeeAdded}
      />
    </Container>
  );
};

export default Employees;

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
