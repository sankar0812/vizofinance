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
  useTheme,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material'
import {
  Users,
  IndianRupee,
  TrendingUp,
  User as UserIcon,
  Download,
  FileText
} from 'lucide-react'

import { useClients } from '../utils/hooks/useClients'
import { formatINR } from '../utils/currency'
import { exportClientsToCSV } from '../utils/export'
import { RevenueLines } from '../components/RevenueLines'
import { ClientsPie } from '../components/ClientsPie'
import { useAuth } from './auth/AuthContext'

export default function DashboardOverview() {
  const { token, user } = useAuth() || {}
  const isAdmin = user?.role === 'ADMIN'
  const isUser = user?.role === 'USER'

  const {
    data: clients,
    loading,
    error,
    refetch,
    deleteClient
  } = useClients(isAdmin)

  const totalClients = clients.length
  const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0)
  const avgRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0
  const activeClients = clients.filter((c) => c.status === 'Active').length
  const userLoanAmount = user?.loanAmount || 0
  const totalPaid = clients.reduce((sum, c) => sum + (c.totalPaid || 0), 0)
  const totalDue = clients.reduce((sum, c) => sum + (c.totalDue || 0), 0)
  const totalInterest = clients.reduce((sum, c) => sum + (c.totalInterest || 0), 0)

  const revenueData = useMemo(() => {
    return clients
      .filter((c) => c.joinedDate && !isNaN(new Date(c.joinedDate)))
      .map((c) => {
        const d = new Date(c.joinedDate)
        const name = d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
        return {
          name,
          actual: c.revenue || 0,
          projected: (c.revenue || 0) * 1.1,
        }
      })
  }, [clients])

  const clientStatusData = useMemo(() => {
    const counts = clients.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [clients])

  const handleExportCSV = () => exportClientsToCSV(clients)

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Finance Dashboard Snapshot', 14, 20)
    doc.setFontSize(11)
    doc.text(`Total Clients: ${totalClients}`, 14, 35)
    doc.text(`Total Revenue: ${formatINR(totalRevenue)}`, 14, 42)
    doc.text(`Avg Revenue: ${formatINR(avgRevenuePerClient)}`, 14, 49)
    doc.text(`Active Clients: ${activeClients}`, 14, 56)
    doc.save('finance-dashboard.pdf')
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const renderCard = (label, value, icon) => (
    <Box
      sx={{
        width: {
          xs: '100%',
          sm: '48%',
          md: '23%',
        },
      }}
    >
      <Card
        sx={{
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f5f5f5',
          boxShadow: 2,
          p: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: 'text.secondary' }}>
          {icon}
        </Box>
      </Card>
    </Box>
  )


  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A comprehensive look at your financial data.
        </Typography>
      </Box>

      {isAdmin ? (
        <>
          {/* Custom Styled Stat Cards */}
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2} p={0} mb={4}>
            {renderCard('Total Clients', totalClients.toLocaleString(), <Users size={20} />)}
            {renderCard('Total Revenue', formatINR(totalRevenue), <IndianRupee size={20} />)}
            {renderCard('Avg. Revenue', formatINR(avgRevenuePerClient), <TrendingUp size={20} />)}
            {renderCard('Active Clients', activeClients.toLocaleString(), <UserIcon size={20} />)}
          </Box>


          {/* Charts */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: { xs: '100%', md: '48%' } }}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Revenue Over Time
                </Typography>
                <RevenueLines data={revenueData} />
              </Paper>
            </Box>

            <Box sx={{ flex: { xs: '100%', md: '48%' } }}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Client Status Distribution
                </Typography>
                <ClientsPie data={clientStatusData} />
              </Paper>
            </Box>
          </Box>


          {/* Clients Table */}
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Clients
            </Typography>

            {loading ? (
              <Skeleton variant="rounded" height={200} />
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load clients. {String(error)}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={refetch}
                >
                  Retry
                </Button>
              </Alert>
            ) : (
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
                          {client.joinedDate
                            ? new Date(client.joinedDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>{formatINR(client.loanAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Export Section */}
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
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={600}>
            Welcome, {user?.email} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Here’s your loan summary
          </Typography>

          <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2} p={1} mb={4}>
            {renderCard('Loan Amount', formatINR(user?.loanAmount || 0), <Users size={20} />)}
            {renderCard('Total Paid', formatINR(totalPaid), <IndianRupee size={20} />)}
            {renderCard('Total Due', formatINR(totalDue), <TrendingUp size={20} />)}
            {renderCard('Total Interest', formatINR(totalInterest), <UserIcon size={20} />)}
          </Box>

        </Box>
      )}
    </Box>
  )
}