import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Mail, Phone, MapPin, Calendar as CalendarIcon, User, Briefcase, KeyRound } from 'lucide-react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const roles = ['EMPLOYEE', 'ADMIN']; // example roles

const EmployeeFormDialog = ({
  open,
  onClose,
  employee,
  onChange,
  onSubmit,
  isEditing = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>

      <DialogContent dividers>
        <form id="employee-form" onSubmit={onSubmit}>
          <div className="container">
            <div className="row g-3">
              <div className="col-md-6">
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Name"
                  name="name"
                  value={employee.name}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="col-md-6">
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Email"
                  name="email"
                  value={employee.email}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  label="Phone"
                  name="phone"
                  value={employee.phone}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="col-md-4">
                <TextField
                  fullWidth
                  size="small"
                  label="Address"
                  name="address"
                  value={employee.address}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="col-md-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Joined Date"
                    value={employee.joinedDate ? new Date(employee.joinedDate) : null}
                    onChange={(newValue) =>
                      onChange({ target: { name: 'joinedDate', value: newValue } })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon size={16} />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="col-md-6">
                <TextField
                  type="password"
                  fullWidth
                  size="small"
                  label="Password"
                  name="password"
                  value={employee.password}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyRound size={16} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="col-md-6">
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Role"
                  name="role"
                  value={employee.role}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Briefcase size={16} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button type="submit" form="employee-form" variant="contained">
          Save Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormDialog;
