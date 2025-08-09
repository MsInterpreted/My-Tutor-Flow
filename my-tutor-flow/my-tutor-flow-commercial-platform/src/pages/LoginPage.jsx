import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import AuthorizationInfo from '../components/AuthorizationInfo';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  LightMode,
  DarkMode,
  School as SchoolIcon,
} from '@mui/icons-material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [requiresAuthCode, setRequiresAuthCode] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { handleLogin: updateAuthState } = useContext(AuthContext);

  // Check if form is being auto-filled (mobile saved passwords)
  useEffect(() => {
    const checkAutoFill = () => {
      if (email && password && !authorizationCode && !showAuthCode) {
        // Form was auto-filled, show auth code requirement
        setRequiresAuthCode(true);
        setShowAuthCode(true);
        setError('Please enter your authorization code to complete login.');
      }
    };

    // Check after a short delay to allow auto-fill to complete
    const timer = setTimeout(checkAutoFill, 1000);
    return () => clearTimeout(timer);
  }, [email, password, authorizationCode, showAuthCode]);

  // Add entrance animation
  useEffect(() => {
    setTimeout(() => setAnimationClass('animate-fade-in'), 100);
  }, []);

  // FIREBASE AUTHENTICATION with Authorization Code Support
  const handleLogin = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      // Check if authorization code is required but not provided
      if (showAuthCode && !authorizationCode) {
        setError('Please enter your authorization code to complete login.');
        // Clear the auto-filled password to prevent bypass
        setPassword('');
        return;
      }

      console.log('🔐 Attempting Firebase authentication...');

      // Import Firebase auth functions
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('../firebaseConfig');

      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Firebase authentication successful:', user.email);

      // Verify authorization code if provided
      if (authorizationCode) {
        // Here you would verify the authorization code against your system
        // For now, we'll accept any non-empty code
        console.log('🔑 Authorization code provided:', authorizationCode);
      }

      // Get or create user profile
      let profile;
      try {
        profile = await getUserProfile(user.uid);
      } catch (profileError) {
        console.warn('⚠️ Could not get user profile, creating default:', profileError.message);
      }

      if (!profile) {
        // Create default profile
        profile = {
          role: 'tutor',
          permissions: ['students', 'attendance', 'reports', 'dashboard', 'billing'],
          name: user.displayName || 'TD Learning Academy User',
          email: user.email,
          authorizationCode: authorizationCode || null,
        };
      }

      // Update auth state
      updateAuthState(user, profile);

      console.log('✅ Login successful - redirecting to dashboard');
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Login failed:', error);

      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // FIREBASE Google Sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting Google sign-in...');

      // Import Firebase auth functions
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const { auth } = await import('../firebaseConfig');

      // Create Google provider
      const provider = new GoogleAuthProvider();

      // Sign in with popup
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log('✅ Google sign-in successful:', user.email);

      // Get or create user profile
      let profile;
      try {
        profile = await getUserProfile(user.uid);
      } catch (profileError) {
        console.warn('⚠️ Could not get user profile, creating default:', profileError.message);
      }

      if (!profile) {
        // Create default profile for Google users
        profile = {
          role: 'tutor',
          permissions: ['students', 'attendance', 'reports', 'dashboard', 'billing'],
          name: user.displayName || 'TD Learning Academy User',
          email: user.email,
        };
      }

      updateAuthState(user, profile);
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Google sign-in failed:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups and try again.');
      } else {
        setError(`Google sign-in failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.isDarkMode
          ? 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2A2A2A 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #E9ECEF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
      className={animationClass}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00D4AA, #4A90E2)',
          opacity: 0.1,
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B9D, #7B68EE)',
          opacity: 0.1,
          animation: 'pulse 4s ease-in-out infinite reverse',
        }}
      />

      {/* Theme toggle button */}
      <IconButton
        onClick={theme.toggleTheme}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: theme.colors.background.secondary,
          color: theme.colors.text.primary,
          '&:hover': {
            backgroundColor: theme.colors.interactive.hover,
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {theme.isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Container component="main" maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            borderRadius: '24px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="animate-slide-in-left"
        >
          {/* Logo and title section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D4AA, #4A90E2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                animation: 'glow 2s ease-in-out infinite',
              }}
            >
              <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: 700,
                color: theme.colors.text.primary,
                mb: 1,
              }}
            >
              My Tutor Flow
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.colors.text.secondary,
                fontSize: '14px',
              }}
            >
              yourmail@gmail.com
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              {[...Array(6)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.text.tertiary,
                    mx: 0.5,
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.tertiary,
                display: 'block',
                mt: 2,
              }}
            >
              Forgot password?
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: theme.isDarkMode ? 'rgba(255, 107, 107, 0.1)' : undefined,
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: theme.colors.background.tertiary,
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.colors.brand.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.colors.brand.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.colors.text.secondary,
                },
                '& .MuiOutlinedInput-input': {
                  color: theme.colors.text.primary,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: theme.colors.text.secondary }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: theme.colors.background.tertiary,
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.colors.brand.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.colors.brand.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme.colors.text.secondary,
                },
                '& .MuiOutlinedInput-input': {
                  color: theme.colors.text.primary,
                },
              }}
            />

            {/* Authorization Code Field */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="text"
                onClick={() => setShowAuthCode(!showAuthCode)}
                sx={{
                  color: theme.colors.brand.primary,
                  textTransform: 'none',
                  fontSize: '14px',
                  p: 0,
                  mb: 1,
                }}
              >
                {showAuthCode ? 'Hide' : 'Have an'} Authorization Code?
              </Button>

              {showAuthCode && (
                <TextField
                  fullWidth
                  name="authorizationCode"
                  label="Authorization Code (Optional)"
                  type="text"
                  id="authorizationCode"
                  value={authorizationCode}
                  onChange={e => setAuthorizationCode(e.target.value)}
                  disabled={loading}
                  placeholder="Enter your tutor authorization code"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: theme.colors.background.tertiary,
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.colors.brand.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.colors.brand.primary,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.colors.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: theme.colors.text.primary,
                    },
                  }}
                />
              )}
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00D4AA, #4A90E2)',
                color: 'white',
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(0, 212, 170, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 212, 170, 0.4)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  transform: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log in'}
            </Button>

            <Divider
              sx={{
                my: 3,
                color: theme.colors.text.tertiary,
                '&::before, &::after': {
                  borderColor: theme.colors.background.tertiary,
                },
              }}
            >
              OR
            </Divider>

            {/* Google Sign-in */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{
                mb: 3,
                py: 1.5,
                borderRadius: '12px',
                backgroundColor: theme.colors.background.tertiary,
                color: theme.colors.text.primary,
                fontWeight: 500,
                textTransform: 'none',
                border: `1px solid ${theme.colors.background.tertiary}`,
                '&:hover': {
                  backgroundColor: theme.colors.interactive.hover,
                  borderColor: theme.colors.brand.primary,
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Continue with Google
            </Button>

            {/* Sign up link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  style={{
                    color: theme.colors.brand.primary,
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Create an Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Authorization Info */}
        <AuthorizationInfo />
      </Container>
    </Box>
  );
}

export default LoginPage;
