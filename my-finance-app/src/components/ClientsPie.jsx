import React from 'react'
import ReactECharts from 'echarts-for-react'

const pieColors = {
  Active: '#86efac',
  Inactive: '#fbbf24',
  Lead: '#a78bfa',
  Unknown: '#cbd5e1',
}

export function ClientsPie({ data }) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0
    },
    series: [
      {
        name: 'Client Status',
        type: 'pie',
        radius: '70%',
        avoidLabelOverlap: false,
        label: {
          formatter: '{b}: {d}%',
          color: '#111'
        },
        data: data.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: pieColors[item.name] || '#94a3b8' }
        }))
      }
    ]
  }

  return <ReactECharts option={option} style={{ width: '100%', height: '300px' }} />
}