import React, { useState, useMemo } from 'react';
import {
  Box, Stack, Typography, Button, TextField, InputAdornment, Paper,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, useMediaQuery, Tooltip, Chip, Dialog, DialogActions, DialogTitle
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  PlusCircle, FileText as FileTextIcon, Edit as EditIcon,
  Trash2 as TrashIcon, Search as SearchIcon, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../utils/hooks/useClients';
import { getClientId } from '../utils/getClientId';
import { useAuth } from './auth/AuthContext';
import UnauthorizedError from './exception/unauthorized';

const Clients = () => {
  const { token, user } = useAuth() || {};
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const { data: clients, loading, error, deleteClient } = useClients();

  // --- filter ---
  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) =>
      (c.name || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  // --- sort ---
  const sortedClients = useMemo(() => {
    if (!sortConfig.key) return filteredClients;
    return [...filteredClients].sort((a, b) => {
      const aValue = typeof a[sortConfig.key] === 'string'
        ? (a[sortConfig.key] || '').toLowerCase()
        : a[sortConfig.key];
      const bValue = typeof b[sortConfig.key] === 'string'
        ? (b[sortConfig.key] || '').toLowerCase()
        : b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [filteredClients, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prev) => {
      const direction =
        prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending';
      return { key, direction };
    });
  };

  const getSortIcon = (name) => {
    if (!sortConfig.key || sortConfig.key !== name)
      return <ChevronDown size={16} opacity={0.3} />;
    return sortConfig.direction === 'ascending'
      ? <ChevronUp size={16} />
      : <ChevronDown size={16} />;
  };

  // --- actions ---
  const handleAddClient = () => navigate('/dashboard/clients/new');
  const handleViewClient = (client) => {
    navigate(`/dashboard/clients/${client._id || client.id}`);
  };

  const handleEditClient = (client) => {
    navigate(`/dashboard/clients/${client._id || client.id}/edit`);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (clientToDelete) {
      deleteClient(clientToDelete._id || clientToDelete.id);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const statusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return { bg: '#86efac', text: '#065f46' }; 
      case 'inactive':
        return { bg: '#fca5a5', text: '#7f1d1d' };
      case 'lead':
        return { bg: '#fde68a', text: '#78350f' };
      default:
        return { bg: '#cbd5e1', text: '#1e293b' };
    }
  };

  if (loading && isAdmin) {
    return (
      <Box p={4}>
        <Typography>Loading clients...</Typography>
      </Box>
    );
  }
  if (error && isAdmin) {
    return (
      <Box p={4}>
        <Typography color="error">Failed to load clients: {error.message}</Typography>
      </Box>
    );
  }

  if(!isAdmin){
    return <UnauthorizedError />;
  }

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={4}
      >
        <Typography variant="h4" fontWeight={700}>Client Management</Typography>
        <Button variant="contained" startIcon={<PlusCircle size={20} />} onClick={handleAddClient}>
          Add New Client
        </Button>
      </Stack>

      {/* Search */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search clients by name or email..."
          value={searchTerm}
          size='small'
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={16} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper elevation={3}>
        {sortedClients?.length === 0 ? (
          <Box py={10} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No clients found. Try adding a new one!
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size={isSm ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => requestSort('name')} sx={{ cursor: 'pointer' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </Stack>
                  </TableCell>
                  <TableCell onClick={() => requestSort('email')} sx={{ cursor: 'pointer' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <span>Email</span>
                      {getSortIcon('email')}
                    </Stack>
                  </TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell onClick={() => requestSort('joinedDate')} sx={{ cursor: 'pointer' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <span>Joined Date</span>
                      {getSortIcon('joinedDate')}
                    </Stack>
                  </TableCell>
                  <TableCell onClick={() => requestSort('status')} sx={{ cursor: 'pointer' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedClients.map((client) => {
                  const key = getClientId(client);
                  return (
                    <TableRow key={key} hover>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.joinedDate}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={client.status || '—'}
                          sx={{
                            backgroundColor: statusColor(client.status).bg,
                            color: statusColor(client.status).text,
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton color="primary" onClick={() => handleViewClient(client)}>
                              <FileTextIcon size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Client">
                            <IconButton color="secondary" onClick={() => handleEditClient(client)}>
                              <EditIcon size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Client">
                            <IconButton color="error" onClick={() => handleDeleteClick(client)}>
                              <TrashIcon size={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete {clientToDelete?.name}?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteClient}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clients;