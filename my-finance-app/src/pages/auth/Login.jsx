import React, { useState } from 'react'
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
        login(email,data.token)
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
    <Grid
      container
      sx={{ height: '100vh' }}
      alignItems="center"
      justifyContent="center"
    >
      {/* Illustration Section */}
      {!isSmallScreen && (
        <Grid
          item
          md={6}
          sx={{
            backgroundColor: '#f5f5f5',
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
          px: 4,
          backgroundColor: isSmallScreen ? '#fff' : '#f9f9f9',
        }}
      >
        <Card
          elevation={isSmallScreen ? 0 : 6}
          sx={{
            maxWidth: 400,
            width: '100%',
            p: 4,
            borderRadius: 3,
            backgroundColor: '#fff',
            mx: 'auto',
          }}
        >
          <Box>
            <img
              src={Logo}
              alt="Company Logo"
              style={{ width: '80px', margin: '0 auto 10px auto', display: 'block' }}
            />
            <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 1 }}>
              Finance Login
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: '#666', mb: 3 }}>
              Welcome to Vizo Finance
            </Typography>
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
                sx={{ mb: 3 }}
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth>
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