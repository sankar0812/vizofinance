import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ScatterChart, Scatter } from 'recharts'
import { formatINR } from '../utils/currency'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

export function RevenueLines({ data }) {
  const theme = useTheme()

  // Adjust chart height based on screen size
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))        // <600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'))  // 600-900px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'))  // 900-1200px
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'))  // 1200-1536px

  let chartWidth = 300
  if (isXs) chartWidth = 200
  else if (isSm) chartWidth = 250
  else if (isMd) chartWidth = 280
  else if (isLg) chartWidth = 500
  else chartWidth = 400

  return (
    <ResponsiveContainer width={chartWidth} height="90%" >
      {data.length > 1 ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis style={{ fontSize: 10 }} tickFormatter={(v) => formatINR(v)} />
          <Tooltip formatter={(v) => formatINR(v)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Revenue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="projected"
            name="Projected Revenue"
            stroke="#82ca9d"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>) : (<ScatterChart margin={{ top: 16, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v) => formatINR(v)} />
          <Tooltip formatter={(v) => formatINR(v)} />
          <Legend />
          <Scatter name="Actual Revenue" data={data} fill="#8884d8" />
          <Scatter name="Projected Revenue" data={data} fill="#82ca9d" />
        </ScatterChart>
      )}
    </ResponsiveContainer>
  )
}