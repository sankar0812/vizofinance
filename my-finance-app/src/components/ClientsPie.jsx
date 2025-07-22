import { useTheme } from '@emotion/react'
import { useMediaQuery } from '@mui/material'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const pieColors = {
  Active: '#86efac',
  Inactive: '#fbbf24',
  Lead: '#a78bfa',
  Unknown: '#cbd5e1',
}

export function ClientsPie({ data }) {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const chartHeight = isSmall ? 200 : 300
  return (
      <ResponsiveContainer width={500} height={chartHeight}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={pieColors[entry.name] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
  )
}
