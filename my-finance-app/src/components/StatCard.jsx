import { Paper, Box, Typography } from '@mui/material'

export function StatCard({ label, value, icon, color }) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        width: 250,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
        <Typography variant="h6">{value}</Typography>
      </Box>
      <Box sx={{ color, ml: 2 }}>{icon}</Box>
    </Paper>
  )
}