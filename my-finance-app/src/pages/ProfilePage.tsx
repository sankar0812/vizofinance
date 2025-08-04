// import { useState, useRef } from 'react';
// import { Box, Typography, Paper, Avatar, IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import { useAuth } from './auth/AuthContext';
// import axios from 'axios';

// type AuthUser = {
//   email?: string;
//   name?: string;
//   password?: string;
//   confirmPassword?: string;
//   role?: string;
// };

// export default function ProfilePage() {
//   const { token, user } = (useAuth() || {}) as { token?: string; user?: AuthUser };
//   const [avatarId, setAvatarId] = useState<number | null>(null);
//   const [avatarUrl, setAvatarUrl] = useState<string>(''); // Holds the backend image URL
//   const fileInputRef = useRef<HTMLInputElement>(null);

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
//       setAvatarUrl(`/api/upload/avatar/${uploadedId}`); // Set the fetched image URL

//     } catch (err) {
//       console.error('Upload failed', err);
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
//               src={avatarUrl} // fallback avatar
//               sx={{ width: 64, height: 64 }}
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
//           maxWidth: 600,
//         }}
//       >
//         <Typography>Name</Typography>
//         <Typography align="right" color="text.secondary">{user?.name}</Typography>

//         <Typography>Email</Typography>
//         <Typography align="right" color="text.secondary">{user?.email}</Typography>

//         <Typography>Password</Typography>
//         <Typography align="right" color="text.secondary">{user?.password}</Typography>

//         <Typography>Confirm Password</Typography>
//         <Typography align="right" color="text.secondary">{user?.confirmPassword}</Typography>
//       </Paper>
//     </Box>
//   );
// }


import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from './auth/AuthContext';
import axios from 'axios';

type AuthUser = {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  avatarId?: number; // Optional initial avatar ID
};

export default function ProfilePage() {
  const { token, user } = (useAuth() || {}) as { token?: string; user?: AuthUser };
  const [avatarId, setAvatarId] = useState<number | null>(user?.avatarId || null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing avatar (GET)
useEffect(() => {
  const fetchAvatar = async () => {
    if (!avatarId || !token) return;

    try {
      const res = await axios.get(`/api/upload/avatar/${avatarId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { base64, mimetype } = res.data;
      const dataUrl = `data:${mimetype};base64,${base64}`;
      setAvatarUrl(dataUrl);
    } catch (err) {
      console.error('Error loading avatar:', err);
    }
  };

  fetchAvatar();
}, [avatarId]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const uploadedId = res.data.id;
      setAvatarId(uploadedId);
      setAvatarUrl(`/api/upload/avatar/${uploadedId}}`);

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
        }
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
              sx={{ width: 64, height: 64 }}
            />
            <img src={avatarUrl} />
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
          maxWidth: 600,
        }}
      >
        <Typography>Name</Typography>
        <Typography align="right" color="text.secondary">{user?.name}</Typography>

        <Typography>Email</Typography>
        <Typography align="right" color="text.secondary">{user?.email}</Typography>

        <Typography>Password</Typography>
        <Typography align="right" color="text.secondary">{user?.password}</Typography>

        <Typography>Confirm Password</Typography>
        <Typography align="right" color="text.secondary">{user?.confirmPassword}</Typography>
      </Paper>
    </Box>
  );
}
