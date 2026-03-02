import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Badge,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  People,
  EventNote,
  Receipt,
  MoreHoriz,
  Assessment,
  Settings,
  Person,
  Logout,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const NAV_HEIGHT = 72;

const primaryTabs = [
  { label: 'Dashboard', icon: Dashboard, path: '/dashboard' },
  { label: 'Students', icon: People, path: '/students' },
  { label: 'Attendance', icon: EventNote, path: '/attendance' },
  { label: 'Billing', icon: Receipt, path: '/billing' },
  { label: 'More', icon: MoreHoriz, path: null },
];

const secondaryItems = [
  { label: 'Reports', icon: Assessment, path: '/reports' },
  { label: 'Payment Settings', icon: Settings, path: '/payment-settings' },
  { label: 'Business', icon: Person, path: '/business' },
];

export default function BottomNavBar({ handleLogout, pendingInvoices = 0 }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getActiveIndex = () => {
    const path = location.pathname;
    const idx = primaryTabs.findIndex(
      (tab) => tab.path && path.startsWith(tab.path)
    );
    // If on a secondary page, highlight "More"
    if (idx === -1) {
      const isSecondary = secondaryItems.some((item) =>
        path.startsWith(item.path)
      );
      if (isSecondary) return 4;
    }
    return idx >= 0 ? idx : 0;
  };

  const handleTabChange = (_event, newValue) => {
    if (newValue === 4) {
      setMoreOpen(true);
    } else {
      const tab = primaryTabs[newValue];
      if (tab?.path) {
        navigate(tab.path);
      }
    }
  };

  const handleSecondaryNav = (path) => {
    setMoreOpen(false);
    navigate(path);
  };

  return (
    <>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          borderTop: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          backgroundColor: theme.colors.background.secondary,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <BottomNavigation
          value={getActiveIndex()}
          onChange={handleTabChange}
          showLabels
          sx={{
            height: `${NAV_HEIGHT}px`,
            backgroundColor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              color: theme.colors.text.secondary,
              minWidth: 'auto',
              padding: '6px 0',
              '&.Mui-selected': {
                color: theme.colors.brand.primary,
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '11px',
                fontWeight: 500,
                '&.Mui-selected': {
                  fontSize: '11px',
                  fontWeight: 600,
                },
              },
              '& .MuiSvgIcon-root': {
                fontSize: '24px',
              },
            },
          }}
        >
          {primaryTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isBilling = tab.label === 'Billing';
            return (
              <BottomNavigationAction
                key={tab.label}
                label={tab.label}
                icon={
                  isBilling && pendingInvoices > 0 ? (
                    <Badge badgeContent={pendingInvoices} color="error" max={99}>
                      <IconComponent />
                    </Badge>
                  ) : (
                    <IconComponent />
                  )
                }
              />
            );
          })}
        </BottomNavigation>
      </Paper>

      {/* "More" Drawer */}
      <Drawer
        anchor="bottom"
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: theme.colors.background.secondary,
            borderRadius: '16px 16px 0 0',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            maxHeight: '60vh',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Drag handle */}
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.colors.text.tertiary,
              mx: 'auto',
              mb: 2,
            }}
          />

          <Typography
            variant="subtitle2"
            sx={{
              color: theme.colors.text.secondary,
              fontWeight: 600,
              px: 1,
              mb: 1,
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '0.5px',
            }}
          >
            More Options
          </Typography>

          <List>
            {secondaryItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => handleSecondaryNav(item.path)}
                    sx={{
                      borderRadius: '12px',
                      mb: 0.5,
                      minHeight: '48px',
                      backgroundColor: isActive
                        ? `${theme.colors.brand.primary}15`
                        : 'transparent',
                      '&:active': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <IconComponent
                      sx={{
                        mr: 2,
                        color: isActive
                          ? theme.colors.brand.primary
                          : theme.colors.text.secondary,
                      }}
                    />
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: isActive
                            ? theme.colors.brand.primary
                            : theme.colors.text.primary,
                          fontWeight: isActive ? 600 : 500,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {/* Logout */}
            <ListItem disablePadding sx={{ mt: 1 }}>
              <ListItemButton
                onClick={() => {
                  setMoreOpen(false);
                  handleLogout();
                }}
                sx={{
                  borderRadius: '12px',
                  minHeight: '48px',
                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                  '&:active': {
                    backgroundColor: 'rgba(244, 67, 54, 0.16)',
                  },
                }}
              >
                <Logout sx={{ mr: 2, color: '#F44336' }} />
                <ListItemText
                  primary="Logout"
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#F44336',
                      fontWeight: 600,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export { NAV_HEIGHT };
