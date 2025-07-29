import React from 'react';
import {
  Box, Typography, Stack, Paper, Divider, Chip, Skeleton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSingleClient } from '../../utils/hooks/useClients';
import UnauthorizedError from '../exception/unauthorized';
import { useAuth } from '../auth/AuthContext';

const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'active': return { bg: '#86efac', text: '#065f46' };
    case 'inactive': return { bg: '#fca5a5', text: '#7f1d1d' };
    case 'lead': return { bg: '#fde68a', text: '#78350f' };
    default: return { bg: '#cbd5e1', text: '#1e293b' };
  }
};

const CurentClientDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth() || {};
  const isAdminOrEmployee = user?.role === 'ADMIN' || user?.role === 'EMPLOYEE';
  const { data: client, loading, error } = useSingleClient(id); // ⬅️ custom hook

  if (!isAdminOrEmployee) return <UnauthorizedError />;
  if (loading) return <Skeleton variant="rectangular" height={200} />;
  if (error || !client) return <Typography color="error">Client not found.</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>Client Details</Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
            <Typography variant="body1">{client.name}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1">{client.email}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
            <Typography variant="body1">{client.phone}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Joined Date</Typography>
            <Typography variant="body1">{client.joinedDate}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Chip
              size="small"
              label={client.status || '—'}
              sx={{
                backgroundColor: statusColor(client.status).bg,
                color: statusColor(client.status).text,
                fontWeight: 500,
              }}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CurentClientDetails;