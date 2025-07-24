import LoanAmortization from '../pages/LoanAmortization'

export async function exportClientsToCSV(clients, fileName = 'clients.csv') {
  const Papa = (await import('papaparse')).default
  const rows = clients.map((c) => ({
    Name: c.name ?? '',
    Status: c.status ?? '',
    Email: c.email ?? '',
    Phone: c.phone ?? '',
    Address: c.address ?? '',
    LoanAmount: c.loanAmount ?? 0,
    LoanTerm: c.loanTerm ?? 0,
    InterestRate: c.interestRate ?? 0,
    MonthlyPayment: c.monthlyPayment ?? 0,
    Revenue: c.revenue ?? 0,
    JoinedDate: c.joinedDate ?? '',
  }))
  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}