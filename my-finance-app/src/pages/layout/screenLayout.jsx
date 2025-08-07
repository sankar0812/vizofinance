import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
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
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Logo from '../../assets/fin.png';
import {
  Menu,
  LayoutDashboard,
  Users as UsersIcon,
  Wallet,
  LogOut,
  UserCheck,
  UserPlus,
  CalendarCheck,
  Headset,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const drawerWidth = 240;
const collapsedWidth = 85;

function DrawerContent({ locationPath, onNavClick, user, logout, isCollapsed }) {
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';
  const isEmployee = user?.role === 'EMPLOYEE';

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };
  

  const navItems = isAdmin
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Clients', path: '/dashboard/clients', icon: <UsersIcon size={18} /> },
        { label: 'Loan Payments', path: '/dashboard/loans', icon: <Wallet size={18} /> },
        { label: 'Assign Clients', path: '/dashboard/assign', icon: <UserCheck size={18} /> },
        { label: 'Add Employee', path: '/dashboard/employee', icon: <UserPlus size={18} /> },
      ]
    : isUser
    ? [{ label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
       { label: 'My Loan Details', path: '/dashboard/myloans', icon: <Wallet size={18} />},
       { label: 'Payment Schedule', path: '/dashboard/mypayment', icon: <CalendarCheck size={18} />},
       { label: 'Contact Support', path: '/dashboard/support', icon: <Headset size={18} />}
       
      ]
    : isEmployee
    ? [ { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> }, 
        { label: 'Loan Management', path: '/dashboard/loans', icon: <Wallet size={18} /> },
        { label: 'Assigned Clients', path: '/dashboard/assigned-clients', icon: <UsersIcon size={18} /> },
        { label: 'Payment Collection', path: '/dashboard/collections', icon: <Wallet size={18} /> }
    ]
    : [];

  const isSelected = (basePath) => {
    if (basePath === '/dashboard') {
      return locationPath === '/dashboard' || locationPath === '/dashboard/';
    }
    return locationPath === basePath || locationPath.startsWith(basePath + '/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 1,
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, gap: 1, cursor: 'pointer' }} onClick={handleLogoClick}>
          <img src={Logo} alt="Company Logo" style={{ width: '100%' }} />
        </Avatar>
        {!isCollapsed && (
          <Typography variant="h6" noWrap>
            FinanceApp
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Nav */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => (
          <Tooltip key={item.path} title={isCollapsed ? item.label : ''} placement="right">
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={isSelected(item.path)}
              onClick={onNavClick}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
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
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Stack spacing={1} alignItems={isCollapsed ? 'center' : 'stretch'}>
          {!isCollapsed && user?.email && (
            <Typography
              variant="caption"
              sx={{ color: 'rgba(214, 214, 214, 0.99)', textAlign: 'center' }}
            >
              {user.email}
            </Typography>
          )}
          {/* <Button
            startIcon={<LogOut size={18} />}
            onClick={logout}
            fullWidth={!isCollapsed}
            variant="contained"
            color="error"
            sx={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          >
            {!isCollapsed && 'Logout'}
          </Button> */}
        </Stack>
      </Box>
    </Box>
  );
}

export default function DashboardLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => setMobileOpen((v) => !v);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const drawer = (
    <DrawerContent
      locationPath={location.pathname}
      onNavClick={() => setMobileOpen(false)}
      user={user}
      logout={() => {
        logout();
        navigate('/login');
      }}
      isCollapsed={isCollapsed}
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
              width: isCollapsed ? collapsedWidth : drawerWidth,
              bgcolor: '#1f1f4aff',
              color: '#fff',
              transition: 'width 0.5s',
              overflowX: 'hidden',
            },
          }}
        >
          {/* Collapse Toggle */}
          <IconButton
            onClick={toggleCollapse}
            sx={{
              position: 'absolute',
              top: 12,
              right: isCollapsed ? -10 : -10,
              zIndex: 1301,
              bgcolor: '#0f172a',
              color: '#fff',
              border: '1px solid #1e293b',
              '&:hover': {
                bgcolor: '#1e293b',
              },
            }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </IconButton>

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
          ...(isDesktop && { ml: `${isCollapsed ? collapsedWidth : drawerWidth}px` }),
          transition: 'margin-left 0.3s',
        }}
      >
        {!isDesktop && <Toolbar />}
        <Outlet />
      </Box>
    </Box>
  );
}
