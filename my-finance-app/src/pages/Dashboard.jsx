// Your imports remain unchanged
import React, { useEffect, useMemo } from 'react'
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
  TrendingDown,
  TrendingUpDownIcon,
  TrendingDownIcon,
  User as UserIcon,
  Download,
  FileText
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useClients } from '../utils/hooks/useClients'
import { formatINR } from '../utils/currency'
import { exportClientsToCSV } from '../utils/export'
import { RevenueLines } from '../components/RevenueLines'
import { ClientsPie } from '../components/ClientsPie'
import { useAuth } from './auth/AuthContext'
import { ProfileDropdown } from '../components/ProfileDropdown'
import { useCurrentClient } from '../utils/hooks/useCurrentClient'
import { useCurrentEmployee } from '../utils/hooks/useCurrentEmployee'

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardOverview() {
  const { token, user } = useAuth() || {}
  const isAdmin = user?.role === 'ADMIN'
  const isEmployee = user?.role === 'EMPLOYEE'
  const isClient = user?.role === 'USER'

  const { data: currentClient, loadingClient } = useCurrentClient({
    enabled: isClient,
  })

  const { data: currentEmployee, loading: loadingEmployee } = useCurrentEmployee({
    enabled: isEmployee,
  })

  useEffect(() => {
    if (currentClient) {
      console.log('Client data:', currentClient)
    }
  }, [currentClient])

  useEffect(() => {
    if (currentEmployee) {
      console.log('Employee data:', currentEmployee)
    }
  }, [currentEmployee])

  const {
    data: clients,
    loading,
    error,
    refetch,
    deleteClient
  } = useClients(isAdmin)


  const {
    data: employee = []
  } = useCurrentEmployee();

  const pieData = [
    { name: "Principal Paid", value: currentClient?.totalPrincipal || 0 },
    { name: "Interest Paid", value: currentClient?.totalInterest || 0 },
    { name: "Remaining Due", value: currentClient?.totalDue || 0 },
  ];

  const paymentData = useMemo(() => {
    if (!currentClient || !currentClient.paymentHistory) return []
    return currentClient.paymentHistory.map(payment => ({
      month: new Date(payment.paymentDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      principal: payment.principalPaid || 0,
      interest: payment.interestPaid || 0,
      total: payment.amountPaid || 0,
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A',
    }))
  }
, [currentClient])


  const totalClients = clients.length
  const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0)
  const avgRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0
  const activeClients = clients.filter((c) => c.status === 'Active').length
  const totalemployee = Array.isArray(employee) ? employee.length : 0


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

const handleExportclientPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Client Dashboard Snapshot", 14, 20);

  // Summary
  doc.setFontSize(12);
  doc.text(`Loan Amount: ${formatINR(currentClient?.loanAmount || 0)}`, 14, 35);
  doc.text(`Total Paid: ${formatINR(currentClient?.totalPaid || 0)}`, 14, 42);
  doc.text(`Total Principal: ${formatINR(currentClient?.totalPrincipal || 0)}`, 14, 49);
  doc.text(`Total Interest: ${formatINR(currentClient?.totalInterest || 0)}`, 14, 56);
  doc.text(`Total Due: ${formatINR(currentClient?.totalDue || 0)}`, 14, 63);

  // ✅ Use autoTable function, not doc.autoTable
  if (currentClient?.paymentHistory?.length > 0) {
    autoTable(doc, {
      startY: 75,
      head: [["#", "Date", "Principal Paid", "Interest Paid", "Total Paid", "Remaining Balance"]],
      body: currentClient.paymentHistory.map((payment, index) => [
        index + 1,
        payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A",
        formatINR(payment.principalPaid || 0),
        formatINR(payment.interestPaid || 0),
        formatINR(payment.amountPaid || 0),
        formatINR(payment.remainingBalance || 0),
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { cellPadding: 3 },
    });
  }

  doc.save("client-dashboard.pdf");
};

// ✅ CSV Export
const handleExportclientCSV = () => {
  if (!currentClient?.paymentHistory?.length) {
    alert("No payment history available for CSV export.");
    return;
  }

  // Prepare CSV rows
  const rows = currentClient.paymentHistory.map((payment, index) => ({
    "#": index + 1,
    Date: payment.paymentDate
      ? new Date(payment.paymentDate).toLocaleDateString()
      : "N/A",
    "Principal Paid": payment.principalPaid || 0,
    "Interest Paid": payment.interestPaid || 0,
    "Total Paid": payment.amountPaid || 0,
    "Remaining Balance": payment.remainingBalance || 0,
  }));

  // Convert to CSV
  const csv = Papa.unparse(rows);

  // Download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "client-dashboard.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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
          backgroundColor: '#ffffffff',
          boxShadow: 5,
          borderRadius: 2,
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          px: 3,
          py: 2,
          backgroundColor: '#edededff',
          borderRadius: 2,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} sx={{
            mb: 0.5,
            fontFamily: 'Roboto, sans-serif',
            fontStyle: 'normal',
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: '#10154cff'
          }}>
            {isAdmin
              ? 'ADMIN DASHBOARD'
              : isEmployee
                ? 'EMPLOYEE DASHBOARD'
                : 'CLIENT DASHBOARD'}
          </Typography>
        </Box>
        <ProfileDropdown />
      </Box>

      {isAdmin ? (
        <>
          <Box display="flex" flexWrap="nowwrap" justifyContent="space-between" gap={3} p={0} mb={4}>
            {renderCard('Total Clients', totalClients.toLocaleString(), <Users size={20} />)}
            {renderCard('Total Revenue', formatINR(totalRevenue), <IndianRupee size={20} />)}
            {renderCard('Avg. Revenue', formatINR(avgRevenuePerClient), <TrendingUp size={20} />)}
            {renderCard('Active Clients', activeClients.toLocaleString(), <UserIcon size={20} />)}
            {renderCard('Total Employee', totalemployee.toLocaleString(), <Users size={20} />)}
          </Box>

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

          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Clients
            </Typography>

            {loading ? (
              <Skeleton variant="rounded" height={200} />
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load clients. {String(error)}
                <Button variant="outlined" size="small" sx={{ ml: 2 }} onClick={refetch}>
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

          <Paper elevation={1} sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">Export Data</Typography>
              <Box>
                <Button variant="contained" color="primary" startIcon={<Download size={16} />} sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }} onClick={handleExportCSV}>
                  Export CSV
                </Button>
                <Button variant="contained" color="error" startIcon={<FileText size={16} />} onClick={handleExportPDF}>
                  Export PDF
                </Button>
              </Box>
            </Stack>
          </Paper>
        </>
      ) : isEmployee ? (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={600}>
            Welcome, {user?.email} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Here’s your dashboard overview
          </Typography>

          {loadingEmployee ? (
            <Skeleton variant="rounded" height={100} width="100%" />
          ) : !currentEmployee ? (
            <Typography color="error">Failed to load employee data</Typography>
          ) : (
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={1} p={1} mb={4}>
              {renderCard('Total Assigned Clients', currentEmployee?.employee?.assignclient, <Users size={20} />)}
              {renderCard('Revenue Collected', formatINR(currentEmployee?.employee?.totalPaid), <IndianRupee size={20} />)}
              {renderCard('EMI Due', formatINR(currentEmployee?.employee?.totalDue), <TrendingUp size={20} />)}
            </Box>
          )}
        </Box>
      ) : null}

      {isClient && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{mb: 2}} fontWeight={600}>
            Welcome, {user?.email}
          </Typography>
          {/* <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Here’s your loan summary
          </Typography> */}
          {loadingClient ? (
            <Skeleton variant="rounded" height={100} width="100%" />
          ) : !currentClient ? (
            <Typography color="error">Failed to load client data</Typography>
          ) : (
            <Box display="flex" flexWrap="nowwrap" justifyContent="space-between" gap={2} p={1} mb={4}>
              {renderCard('Loan Amount', formatINR(currentClient?.loanAmount || 0), <IndianRupee size={20} />)}
              {renderCard('Total Paid', formatINR(currentClient.totalPaid || 0), <IndianRupee size={20} />)}
              {renderCard ('Total Principal', formatINR(currentClient.totalPrincipal || 0), <TrendingUp size={20} />)} 
              {renderCard('Total Interest', formatINR(currentClient.totalInterest || 0), <TrendingUpDownIcon size={20} />)}
              {renderCard('Total Due', formatINR(currentClient.totalDue || 0), <TrendingDownIcon size={20} />)}
            </Box>
          )}
            {/* Charts Section */}
            <Grid container spacing={3} mt={2}>
              {/* Line / Bar Chart for Payment History */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, height: 400 , width: 500}}>
                  <Typography variant="h6" gutterBottom>
                    Payment History
                  </Typography>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={paymentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="principal" fill="#82ca9d" />
                      <Bar dataKey="interest" fill="#8884d8" />
                      <Bar dataKey="total" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Pie Chart Breakdown */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: 400, width: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Loan Breakdown
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={115}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) =>
                          `${name}: ${formatINR(value)}`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
            <Paper elevation={1} sx={{ p: 3, mt: 5, mb: 2}}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1">Export Data</Typography>
              <Box>
                <Button variant="contained" color="primary" startIcon={<Download size={16} />} sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }} onClick={handleExportclientCSV}>
                  Export CSV
                </Button>
                <Button variant="contained" color="error" startIcon={<FileText size={16} />} onClick={handleExportclientPDF}>
                  Export PDF
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  )
}