import React from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from '@mui/material/styles'

export function RevenueLines({ data }) {
  const theme = useTheme()

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Actual Revenue', 'Projected Revenue'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.name)
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: value => `₹${value.toLocaleString()}`
      }
    },
    series: [
      {
        name: 'Actual Revenue',
        type: 'line',
        data: data.map(item => item.actual),
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 3, color: '#4f46e5' }
      },
      {
        name: 'Projected Revenue',
        type: 'line',
        data: data.map(item => item.projected),
        smooth: true,
        symbol: 'circle',
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: '#10b981'
        }
      }
    ]
  }

  return <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
}