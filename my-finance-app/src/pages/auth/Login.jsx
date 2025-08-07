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
  CircularProgress,
  Paper,
} from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'

// Images
import BackgroundImage from '../../assets/login-bg3.jpg'
import Logo from '../../assets/fin.png'

// Preload images for better UX
const preloadImage = (src) => {
  const img = new Image()
  img.src = src
}
preloadImage(Logo)
preloadImage(BackgroundImage)

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const API_BASE = import.meta.env.VITE_APP_BASE_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        login(email, data?.name, data?.role, data.token)
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid
      container
      sx={{
        height: '100vh',
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 400,
          borderRadius: 4,
          backgroundColor: 'rgba(238, 244, 251, 0.9)',
          backdropFilter: 'blur(1px)',
        }}
      >
        <Box textAlign="center" mb={4}>
          <img src={Logo} alt="Vizo Logo" style={{ width: 60, marginBottom: 8 }} />
          <Typography variant="h5" fontWeight="bold">
            Finance Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome to Vizo Finance
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            margin="normal"
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
            <Typography variant="body2" color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: '#387dc3ff',
              '&:hover': { backgroundColor: '#125ea5ff' },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Grid>
  )
}

export default Login
