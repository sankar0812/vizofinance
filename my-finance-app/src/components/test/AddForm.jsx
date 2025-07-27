import React from 'react';
import {
  TextField,
  MenuItem,
  Typography,
  Paper,
  Box,
} from '@mui/material';

const statusOptions = ['Active', 'Inactive', 'Lead'];
const ageOptions = [10, 20, 30];

export default function ClientFormNew() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    status: '',
    dob: '',
    phone: '',
    address1: '',
    address2: '',
    pincode: '',
    state: '',
    city: '',
    country: '',
    joinedDate: '',
    age: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputStyle = {
    '& .MuiInputBase-root': {
      height: '40px',
    },
  };

  return (
    <div className="container mt-4">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Client Details Form
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <div className="row g-4">
            {/* Row 1 */}
            <div className="col-md-4">
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                select
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              >
                {ageOptions.map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* Row 2 */}
            <div className="col-md-4">
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                label="Address Line 1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>

            {/* Row 3 */}
            <div className="col-md-4">
              <TextField
                label="Address Line 2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>

            {/* Row 4 */}
            <div className="col-md-4">
              <TextField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              />
            </div>
            <div className="col-md-4">
              <TextField
                label="Joined Date"
                name="joinedDate"
                type="date"
                value={formData.joinedDate}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />
            </div>

            {/* Row 5 */}
            <div className="col-md-4">
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={inputStyle}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status.toLowerCase()}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
        </Box>
      </Paper>
    </div>
  );
}