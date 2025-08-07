// // components/ProfileDropdown.jsx
// import React, { useState } from 'react'
// import {
//   Avatar,
//   Menu,
//   MenuItem,
//   IconButton,
//   Typography,
//   Divider
// } from '@mui/material'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../pages/auth/AuthContext'

// export const ProfileDropdown = () => {
//   const { logout, user } = useAuth()
//   const [anchorEl, setAnchorEl] = useState(null)
//   const navigate = useNavigate()

//   const handleOpen = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   const handleLogout = () => {
//     logout()
//     handleClose()
//   }

//   return (
//     <>
//       <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
//         <Avatar sx={{ width: 36, height: 36 }}>
//           {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
//         </Avatar>
//       </IconButton>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <MenuItem disabled>
//           <Typography variant="subtitle2">{user?.name || user?.email}</Typography>
//         </MenuItem>
//         <Divider />
//         <MenuItem
//           onClick={() => {
//             navigate('/dashboard/profile')
//             handleClose()
//           }}
//         >
//           My Account
//         </MenuItem>
//         <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
//           Log Out
//         </MenuItem>
//       </Menu>
//     </>
//   )
// }


// components/ProfileDropdown.jsx
import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../pages/auth/AuthContext'

const API_BASE = 'http://localhost:5000';

export const ProfileDropdown = () => {
  const { logout, user, token } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')

  const navigate = useNavigate()

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
  }

  // Load avatar from localStorage or user data
  useEffect(() => {
    const storedId = localStorage.getItem('avatarId')
    const idToUse = storedId || user?.avatarId
    if (idToUse && token) {
      setAvatarUrl(`${API_BASE}/api/upload/avatar/${idToUse}`)
    }
  }, [user, token])

  return (
    <>
      <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
        <Avatar src={avatarUrl || undefined} sx={{ width: 36, height: 36 }}>
          {!avatarUrl && (user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase())}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">{user?.name || user?.email}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            navigate('/dashboard/profile')
            handleClose()
          }}
        >
          My Account
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
          Log Out
        </MenuItem>
      </Menu>
    </>
  )
}
