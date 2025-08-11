import React, { useState, useEffect, useContext, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link as RouterLink,
} from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard,
  People,
  EventNote,
  Receipt,
  Assessment,
  SupervisorAccount,
} from '@mui/icons-material';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { NavigationLogo } from './components/branding/CustomMyTutorFlowLogo';
import { BrandingProvider } from './contexts/BrandingContext';
import ErrorBoundary from './components/ErrorBoundary';
import DiagnosticPanel from './components/DiagnosticPanel';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const WelcomePage = React.lazy(() => import('./pages/WelcomePage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const StudentsPage = React.lazy(() => import('./pages/StudentsPage'));
const StudentProfilePage = React.lazy(() => import('./pages/StudentProfilePage'));
const AddEditStudentPage = React.lazy(() => import('./pages/AddEditStudentPage'));
const AttendancePage = React.lazy(() => import('./pages/AttendancePage'));
const BillingPage = React.lazy(() => import('./pages/BillingPage'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage'));
const UserManagementPage = React.lazy(() => import('./pages/UserManagementPage'));
const BusinessDashboard = React.lazy(() => import('./pages/BusinessDashboard'));
const PitchPresentationPage = React.lazy(() => import('./pages/PitchPresentationPage'));
const HackathonPitchPage = React.lazy(() => import('./pages/HackathonPitchPage'));
const LogoShowcasePage = React.lazy(() => import('./pages/LogoShowcasePage'));
const TextLogoShowcasePage = React.lazy(() => import('./pages/TextLogoShowcasePage'));
const BonkShowcasePage = React.lazy(() => import('./pages/BonkShowcasePage'));

const InvoicePreview = React.lazy(() => import('./components/InvoicePreview'));


// Create theme for scalability
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Auth Context import
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { SolanaWalletProvider } from './contexts/SolanaWalletContext';

// Enhanced Loading component with TD Learning Academy branding
const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #00796B, #004D40)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}
  >
    <Box
      sx={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid #FFD700',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        mb: 2,
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    />
    <Box sx={{ fontSize: '24px', fontWeight: 600, mb: 1 }}>TD Learning Academy</Box>
    <Box sx={{ fontSize: '14px', opacity: 0.8 }}>Loading your tutoring platform...</Box>
  </Box>
);

// Mobile-responsive NavBar component for authenticated users
function NavBar({ userRole, handleLogout }) {
  const location = useLocation();
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = path => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Dashboard },
    { label: 'Students', path: '/students', icon: People },
    { label: 'Attendance', path: '/attendance', icon: EventNote },
    { label: 'Billing', path: '/billing', icon: Receipt },
    { label: 'Reports', path: '/reports', icon: Assessment },
  ];

  if (userRole === 'admin') {
    navItems.push({ label: 'Users', path: '/users', icon: SupervisorAccount });
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        className="android-material-surface"
        sx={{
          background: theme.colors.background.secondary,
          borderBottom: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          // Android 15 optimizations
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          // Safe area support for notched displays
          paddingTop: 'env(safe-area-inset-top, 0px)',
          // Material You dynamic colors
          backgroundColor: 'var(--android-dynamic-surface, ' + theme.colors.background.secondary + ')',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              component={RouterLink}
              to="/business"
              sx={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <NavigationLogo size={isMobile ? "small" : "medium"} showText={!isMobile} />
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navItems.map(item => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: isActive(item.path)
                      ? theme.colors.brand.primary
                      : theme.colors.text.secondary,
                    backgroundColor: isActive(item.path) ? 'rgba(0, 212, 170, 0.1)' : 'transparent',
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: isActive(item.path) ? 600 : 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: theme.colors.interactive.hover,
                      color: theme.colors.brand.primary,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Theme Toggle */}
              <IconButton
                onClick={theme.toggleTheme}
                sx={{
                  color: theme.colors.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.colors.interactive.hover,
                  },
                }}
              >
                {theme.isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                sx={{
                  color: theme.colors.text.secondary,
                  borderRadius: '8px',
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.colors.interactive.hover,
                    color: theme.colors.brand.primary,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle for Mobile */}
              <IconButton
                onClick={theme.toggleTheme}
                sx={{
                  color: theme.colors.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.colors.interactive.hover,
                  },
                }}
              >
                {theme.isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>

              {/* Mobile Menu Toggle */}
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{
                  color: theme.colors.text.secondary,
                  '&:hover': {
                    backgroundColor: theme.colors.interactive.hover,
                  },
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          className="android-drawer"
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              maxWidth: '85vw', // Responsive width for small screens
              backgroundColor: 'var(--android-dynamic-surface, ' + theme.colors.background.secondary + ')',
              borderLeft: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              // Android 15 optimizations
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              // Safe area support
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              // Material You styling
              borderRadius: '16px 0 0 16px',
              // Enhanced touch targets
              '& .MuiListItemButton-root': {
                minHeight: 'var(--android-touch-target-comfortable, 56px)',
                borderRadius: '12px',
                margin: '4px 8px',
                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
              },
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <NavigationLogo size="medium" showText={true} />
            </Box>

            <List>
              {navItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      component={RouterLink}
                      to={item.path}
                      onClick={handleMobileMenuClose}
                      sx={{
                        borderRadius: '8px',
                        mb: 1,
                        backgroundColor: isActive(item.path) ? 'rgba(0, 212, 170, 0.1)' : 'transparent',
                        '&:hover': {
                          backgroundColor: theme.colors.interactive.hover,
                        },
                      }}
                    >
                      <IconComponent
                        sx={{
                          mr: 2,
                          color: isActive(item.path) ? theme.colors.brand.primary : theme.colors.text.secondary
                        }}
                      />
                      <ListItemText
                        primary={item.label}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: isActive(item.path) ? theme.colors.brand.primary : theme.colors.text.primary,
                            fontWeight: isActive(item.path) ? 600 : 500,
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}

              {/* Mobile Logout Button */}
              <ListItem disablePadding sx={{ mt: 2 }}>
                <ListItemButton
                  onClick={() => {
                    handleMobileMenuClose();
                    handleLogout();
                  }}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    },
                  }}
                >
                  <ListItemText
                    primary="Logout"
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: '#ff4444',
                        fontWeight: 600,
                        textAlign: 'center',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}
    </>
  );
}



// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser, userRole, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!loadingAuth) {
      if (!currentUser) {
        navigate('/login', { replace: true });
      } else if (requiredRole && userRole !== requiredRole) {
        setNotification({
          open: true,
          message: "You don't have permission to view this page.",
          severity: 'error',
        });
        navigate('/dashboard', { replace: true });
      }
    }
  }, [loadingAuth, currentUser, userRole, requiredRole, navigate]);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  if (!currentUser || (requiredRole && userRole !== requiredRole)) {
    return (
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    );
  }

  return children;
}

// SIMPLIFIED App Component - NO COMPLEX ERROR HANDLING
function App() {
  return (
    <ErrorBoundary>
      <BrandingProvider>
        <ThemeProvider>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <AuthProvider>
                <SolanaWalletProvider>
                  <AppContent />
                </SolanaWalletProvider>
              </AuthProvider>
            </Router>
          </MuiThemeProvider>
        </ThemeProvider>
      </BrandingProvider>
    </ErrorBoundary>
  );
}

// App Content Component (needs to be inside Router for useLocation)
function AppContent() {
  const { currentUser, userRole, handleLogout } = useContext(AuthContext);
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Keyboard shortcut for diagnostic panel (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        setShowDiagnostic(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {currentUser && <NavBar userRole={userRole} handleLogout={handleLogout} />}
      <Box
        sx={{
          p: 0,
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          backgroundColor: theme.colors.background.primary,
          // Ensure consistent background
          '& *': {
            maxWidth: '100%',
          },
          // Mobile-specific adjustments
          ...(isMobile && {
            '& .MuiContainer-root': {
              paddingLeft: '8px !important',
              paddingRight: '8px !important',
              maxWidth: '100% !important',
            },
            '& .MuiPaper-root': {
              backgroundColor: theme.colors.background.secondary,
              margin: '8px 0',
            },
            '& .MuiTableContainer-root': {
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
            },
          }),
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route
              path="/signup"
              element={currentUser ? <Navigate to="/dashboard" replace /> : <SignUpPage />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business"
              element={
                <ProtectedRoute>
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/add"
              element={
                <ProtectedRoute>
                  <AddEditStudentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/edit/:id"
              element={
                <ProtectedRoute>
                  <AddEditStudentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/:id"
              element={
                <ProtectedRoute>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <BillingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invoice-preview"
              element={
                <ProtectedRoute>
                  <InvoicePreview />
                </ProtectedRoute>
              }
            />

            {/* Pitch Presentation - Public Route */}
            <Route
              path="/pitch"
              element={<PitchPresentationPage />}
            />

            {/* Hackathon Pitch - Public Route */}
            <Route
              path="/hackathon-pitch"
              element={<HackathonPitchPage />}
            />

            {/* Logo Showcase - Public Route */}
            <Route
              path="/logo-showcase"
              element={<LogoShowcasePage />}
            />

            {/* Text Logo Showcase - Public Route */}
            <Route
              path="/text-logo"
              element={<TextLogoShowcasePage />}
            />

            {/* BONK Showcase - Public Route */}
            <Route
              path="/bonk-showcase"
              element={<BonkShowcasePage />}
            />

            {/* Welcome Page - Public Route */}
            <Route path="/welcome" element={<WelcomePage />} />

            {/* Default Routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="*" element={<WelcomePage />} />
          </Routes>
        </Suspense>
      </Box>

      {/* Diagnostic Panel - Press Ctrl+Shift+D to open */}
      {showDiagnostic && (
        <DiagnosticPanel onClose={() => setShowDiagnostic(false)} />
      )}
    </>
  );
}

export default App;
