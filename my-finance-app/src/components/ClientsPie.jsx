// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

// const pieColors = {
//   Active: '#86efac',
//   Inactive: '#fbbf24',
//   Lead: '#a78bfa',
//   Unknown: '#cbd5e1',
// }

// export function ClientsPie({ data }) {
//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <PieChart>
//         <Pie
//           data={data}
//           dataKey="value"
//           nameKey="name"
//           outerRadius={100}
//           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//         >
//           {data.map((entry, i) => (
//             <Cell key={i} fill={pieColors[entry.name] || '#94a3b8'} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   )
// }


import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const pieColors = {
  Active: '#86efac',
  Inactive: '#fbbf24',
  Lead: '#a78bfa',
  Unknown: '#cbd5e1',
}

export function ClientsPie({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow w-full h-[350px]">
      <h3 className="text-lg font-semibold mb-4">Client Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
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
    </div>
  )
}
