import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Card
} from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import Illustration from '../../assets/login-illustrate.png'
import Logo from '../../assets/fin.png'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

const preloadImage = (src) => {
  const img = new Image()
  img.src = src
}
preloadImage(Logo)
preloadImage(Illustration)

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const API_BASE = import.meta.env.VITE_APP_BASE_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        login(email, data?.name, data?.role, data.token)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    }
  }

  return (
    <Grid container sx={{ height: '100vh' }} alignItems="center" justifyContent="center">
      {/* Image Section */}
      {!isSmallScreen && (
        <Grid
          item
          md={6}
          sx={{
            background: 'linear-gradient(to bottom right, #f0f4f8, #d9e2ec)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
          }}
        >
          <Box sx={{ maxWidth: 500, width: '100%' }}>
            <img
              src={Illustration}
              alt="Illustration"
              loading="eager"
              style={{ width: '100%', maxWidth: '500px' }}
            />
          </Box>
        </Grid>
      )}

      {/* Form Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          backgroundColor: isSmallScreen ? '#fff' : '#f9f9f9',
        }}
      >
        <Card
          elevation={isSmallScreen ? 0 : 10}
          sx={{
            maxWidth: 420,
            width: '100%',
            p: 5,
            borderRadius: 3,
            backgroundColor: '#fff',
            mx: 'auto',
          }}
        >
          <Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img src={Logo} alt="Company Logo" style={{ width: '70px' }} />
              <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                Finance Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome to Vizo Finance
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                Login
              </Button>
            </form>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Login