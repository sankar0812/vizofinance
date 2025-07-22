import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useMediaQuery,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu,
  LayoutDashboard,
  Users as UsersIcon,
  Wallet,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Clients', path: '/dashboard/clients', icon: <UsersIcon size={18} /> },
  { label: 'Loan Payments', path: '/dashboard/loans', icon: <Wallet size={18} /> },
];

function DrawerContent({ locationPath, onNavClick, user, logout }) {
  const isSelected = (basePath) => {
    if (basePath === '/dashboard') {
      return locationPath === '/dashboard' || locationPath === '/dashboard/';
    }
    return locationPath === basePath || locationPath.startsWith(basePath + '/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Branding */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>F</Avatar>
        <Typography variant="h6" noWrap>
          FinanceApp
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Nav */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={isSelected(item.path)}
            onClick={onNavClick}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              color: 'inherit',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' },
              },
              '&:hover': {
                bgcolor: 'primary.dark',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Footer / user */}
      <Box sx={{ p: 2 }}>
        <Stack spacing={1}>
          {user?.email && (
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}
            >
              {user.email}
            </Typography>
          )}
          <Button
            startIcon={<LogOut size={18} />}
            onClick={logout}
            fullWidth
            variant="contained"
            color="error"
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

const handleLogout = () => {
  logout();
  navigate('/login');
};

export default function DashboardLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => setMobileOpen((v) => !v);

  const drawer = (
    <DrawerContent
      locationPath={location.pathname}
      onNavClick={() => setMobileOpen(false)}
      user={user}
      logout={logout}
    />
  );

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* Top bar (mobile only) */}
      {!isDesktop && (
        <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
              aria-label="open navigation menu"
            >
              <Menu size={20} />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              FinanceApp
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile drawer */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#0f172a',
              color: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Desktop drawer */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#0f172a',
              color: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: (t) =>
            t.palette.mode === 'light' ? '#f5f7fa' : t.palette.background.default,
          p: { xs: 2, sm: 3 },
          ...(isDesktop && { ml: `${drawerWidth}px` }),
        }}
      >
        {/* Spacer for mobile app bar */}
        {!isDesktop && <Toolbar />}

        {/* Nested route content */}
        <Outlet />
      </Box>
    </Box>
  );
}
