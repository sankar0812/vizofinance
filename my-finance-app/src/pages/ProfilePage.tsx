// import { useState, useRef, useEffect, useCallback, use } from 'react';
// import { Box, Typography, Paper, Avatar, IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import { useAuth } from './auth/AuthContext';
// import axios from 'axios';


// const API_BASE = 'http://localhost:5000'



// type AuthUser = {
//   email: string;
//   name: string;
//   role: string;
//   token?: string;
//   avatarId?: number | null;
//   loanAmount?: number;
//   totalPaid?: number;
//   totalDue?: number;
//   totalInterest?: number;
// };

// export default function ProfilePage() {
//   const { token, user } = (useAuth() || {}) as { token?: string; user?: AuthUser };
//   const [avatarId, setAvatarId] = useState<number | null>(user?.avatarId ?? null);
//   const [avatarUrl, setAvatarUrl] = useState<string>('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Load avatar
//   useEffect(() => {
//     const fetchAvatar = async () => {
//       if (!avatarId || !token) return;

//       try {
//         setAvatarUrl(`${API_BASE}/api/upload/avatar/${avatarId}`);
//       } catch (err) {
//         console.error('Error loading avatar:', err);
//       }
//     };

//     fetchAvatar();
//   }, [avatarId, token]);



//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !token) return;

//     const formData = new FormData();
//     formData.append('avatar', file);

//     try {
//       const res = await axios.post('/api/upload/avatar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const uploadedId = res.data.id;
//       setAvatarId(uploadedId);
//     } catch (err: any) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         alert('Session expired. Please log in again.');
//       }
//       console.error('Avatar upload failed:', err);
//     }
//   };

//   const handleEditClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <Box sx={{ px: 4, py: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Box sx={{ position: 'relative' }}>
//             <Avatar
//               src={avatarUrl || '/default-avatar.png'}
//               sx={{ width: 72, height: 72 }}
//             />
//             <IconButton
//               onClick={handleEditClick}
//               sx={{
//                 position: 'absolute',
//                 bottom: 0,
//                 right: 0,
//                 backgroundColor: '#fff',
//                 border: '1px solid #ddd',
//                 p: 0.5,
//               }}
//             >
//               <EditIcon fontSize="small" />
//             </IconButton>
//             <input
//               type="file"
//               accept="image/*"
//               ref={fileInputRef}
//               style={{ display: 'none' }}
//               onChange={handleFileChange}
//             />
//           </Box>
//           <Typography variant="h6">{user?.role}</Typography>
//         </Box>

//         <Box>
//           <Typography variant="body2" sx={{ textAlign: 'right' }}>Recently Saved Changes</Typography>
//           <Typography variant="subtitle2" sx={{ color: '#3f51b5', fontWeight: 500 }}>
//             {new Date().toISOString().split('T')[0]} &nbsp;
//             {new Date().toLocaleTimeString()}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Personal Info */}
//       <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
//         Personal Info
//       </Typography>

//       <Paper
//         elevation={3}
//         sx={{
//           p: 3,
//           borderRadius: 2,
//           display: 'grid',
//           gridTemplateColumns: '1fr 1fr',
//           gap: 2,
//           maxWidth: "100%",
//         }}
//       >
//         <Typography>Name</Typography>
//         <Typography align="right" color="text.secondary">{user?.name}</Typography>

//         <Typography>Email</Typography>
//         <Typography align="right" color="text.secondary">{user?.email}</Typography>

//         <Typography>Role</Typography>
//         <Typography align="right" color="text.secondary">{user?.role}</Typography>
//       </Paper>

//     </Box>
//   );
// }


import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from './auth/AuthContext';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_APP_BASE_URL;

type AuthUser = {
  email: string;
  name: string;
  role: string;
  token?: string;
  avatarId?: number | null;
  loanAmount?: number;
  totalPaid?: number;
  totalDue?: number;
  totalInterest?: number;
};

export default function ProfilePage() {
  const { token, user } = (useAuth() || {}) as { token?: string; user?: AuthUser };
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load avatarId from localStorage or user object
  useEffect(() => {
    const storedId = localStorage.getItem('avatarId');
    const idToUse = storedId ? Number(storedId) : user?.avatarId ?? null;
    if (idToUse && token) {
      setAvatarId(idToUse);
      setAvatarUrl(`${API_BASE}/api/upload/avatar/${idToUse}`);
    }
  }, [user, token]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post(`${API_BASE}/api/upload/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const uploadedId = res.data.id;
      setAvatarId(uploadedId);
      setAvatarUrl(`${API_BASE}/api/upload/avatar/${uploadedId}`);
      localStorage.setItem('avatarId', String(uploadedId));
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert('Session expired. Please log in again.');
      }
      console.error('Avatar upload failed:', err);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ px: 4, py: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarUrl || '/default-avatar.png'}
              sx={{ width: 72, height: 72 }}
            />
            <IconButton
              onClick={handleEditClick}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                p: 0.5,
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>
          <Typography variant="h6">{user?.role}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ textAlign: 'right' }}>Recently Saved Changes</Typography>
          <Typography variant="subtitle2" sx={{ color: '#3f51b5', fontWeight: 500 }}>
            {new Date().toISOString().split('T')[0]} &nbsp;
            {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      {/* Personal Info */}
      <Typography variant="h5" color="primary" fontWeight={600} mb={2}>
        Personal Info
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          maxWidth: "100%",
        }}
      >
        <Typography>Name</Typography>
        <Typography align="right" color="text.secondary">{user?.name}</Typography>

        <Typography>Email</Typography>
        <Typography align="right" color="text.secondary">{user?.email}</Typography>

        <Typography>Role</Typography>
        <Typography align="right" color="text.secondary">{user?.role}</Typography>
      </Paper>
    </Box>
  );
}
