import React, { useMemo } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Container,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material'
import { Users, IndianRupee, TrendingUp, User as UserIcon, Download, FileText, Edit, Trash } from 'lucide-react'

import { useClients } from '../utils/hooks/useClients'
import { formatINR } from '../utils/currency'
import { exportClientsToCSV } from '../utils/export'
import { StatCard } from '../components/StatCard'
import { RevenueLines } from '../components/RevenueLines'
import { ClientsPie } from '../components/ClientsPie'
import { useAuth } from './auth/AuthContext'

export default function DashboardOverview() {
  const { token, user } = useAuth() || {};
  const isAdmin = user?.role === 'ADMIN';
  const { data: clients, loading, error, refetch, deleteClient } = useClients(isAdmin);

  // ---- summary metrics --------------------------------------------------
  const totalClients = clients.length
  const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0)
  const avgRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0
  const activeClients = clients.filter((c) => c.status === 'Active').length

  const revenueData = useMemo(() => {
    return clients
      .filter((c) => c.joinedDate && !isNaN(new Date(c.joinedDate)))
      .map((c) => {
        const d = new Date(c.joinedDate);
        const name = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        return {
          name,
          actual: c.revenue || 0,
          projected: (c.revenue || 0) * 1.1,
        };
      });
  }, [clients]);

  // ---- client status distribution --------------------------------------
  const clientStatusData = useMemo(() => {
    const counts = clients.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [clients])

  // ---- export handlers --------------------------------------------------
  const handleExportCSV = () => exportClientsToCSV(clients)

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Finance Dashboard Snapshot', 14, 20)
    doc.setFontSize(11)
    doc.text(`Total Clients: ${totalClients}`, 14, 35)
    doc.text(`Total Revenue: ${formatINR(totalRevenue)}`, 14, 42)
    doc.text(`Avg Revenue/Client: ${formatINR(avgRevenuePerClient)}`, 14, 49)
    doc.text(`Active Clients: ${activeClients}`, 14, 56)
    doc.save('finance-dashboard.pdf')
  }

  // ---- loading / error states ------------------------------------------
  if (loading && isAdmin) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={320} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={320} sx={{ mb: 2 }} />
      </Container>
    )
  }

  if (error && isAdmin) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load clients. {String(error)}
        </Alert>
        <Button variant="contained" onClick={refetch}>
          Retry
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A comprehensive look at your financial data.
        </Typography>
      </Box>

      {user?.role === 'Admin' ? (
        <>
          {/* State Cards */}
          <Grid
            container
            spacing={2}
            sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'stretch' }}
          >
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <StatCard
                label="Total Clients"
                value={totalClients.toLocaleString()}
                icon={<Users size={20} />}
                color="primary.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <StatCard
                label="Total Revenue"
                value={formatINR(totalRevenue)}
                icon={<IndianRupee size={20} />}
                color="success.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <StatCard
                label="Avg. Revenue/Client"
                value={formatINR(avgRevenuePerClient)}
                icon={<TrendingUp size={20} />}
                color="secondary.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
              <StatCard
                label="Active Clients"
                value={activeClients.toLocaleString()}
                icon={<UserIcon size={20} />}
                color="warning.main"
              />
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={2} sx={{ mb: 4, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3, height: '100%', width: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Revenue Over Time
                </Typography>
                <RevenueLines data={revenueData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Client Status Distribution
                </Typography>
                <ClientsPie data={clientStatusData} />
              </Paper>
            </Grid>
          </Grid>

          {/* Clients Table */}
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Clients
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Joined Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.status}</TableCell>
                      <TableCell>{formatINR(client.revenue)}</TableCell>
                      <TableCell>
                        {client.joinedDate ? new Date(client.joinedDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>{formatINR(client.loanAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Export Buttons */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="subtitle1">Export Data</Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download size={16} />}
                  sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}
                  onClick={handleExportCSV}
                >
                  Export CSV
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FileText size={16} />}
                  onClick={handleExportPDF}
                >
                  Export PDF
                </Button>
              </Box>
            </Stack>
          </Paper>
        </>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={600}>
            Welcome, {user?.email} 👋
          </Typography>
        </Box>
      )}
    </Box>
  );
}