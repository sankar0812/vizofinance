import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { formatINR } from '../utils/currency'

export function RevenueLines({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(v) => formatINR(v)} />
        <Tooltip formatter={(v) => formatINR(v)} />
        <Legend />
        <Line type="monotone" dataKey="actual" name="Actual Revenue" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="projected" name="Projected Revenue" stroke="#82ca9d" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}