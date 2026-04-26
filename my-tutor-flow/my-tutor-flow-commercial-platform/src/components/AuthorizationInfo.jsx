import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Alert,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Info as InfoIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const AuthorizationInfo = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  // Predefined authorization codes for easy reference
  const authorizationCodes = [
    {
      code: 'MASTER-TUTOR-2024',
      role: 'admin',
      description: 'Master Admin Access - Primary Owner',
      permissions: 'All features including user management and business dashboard',
    },
    {
      code: 'ADMIN-PARTNER-001',
      role: 'admin',
      description: 'Admin Access - Business Partner',
      permissions: 'All features including user management and business dashboard',
    },
    {
      code: 'ADMIN-MANAGER-001',
      role: 'admin',
      description: 'Admin Access - Operations Manager',
      permissions: 'All features including user management and business dashboard',
    },
    {
      code: 'TUTOR-ASSIST-001',
      role: 'tutor',
      description: 'Assistant Tutor Access - Standard tutoring features',
      permissions: 'Students, Attendance, Reports, Dashboard',
    },
    {
      code: 'TUTOR-ASSIST-002',
      role: 'tutor',
      description: 'Assistant Tutor Access - Standard tutoring features',
      permissions: 'Students, Attendance, Reports, Dashboard',
    },
    {
      code: 'TUTOR-ASSIST-003',
      role: 'tutor',
      description: 'Assistant Tutor Access - Standard tutoring features',
      permissions: 'Students, Attendance, Reports, Dashboard',
    },
    {
      code: 'TUTOR-VIEW-001',
      role: 'viewer',
      description: 'View Only Access - Limited to viewing data',
      permissions: 'Students (view only), Reports (view only)',
    },
  ];

  const copyToClipboard = code => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getRoleColor = role => {
    switch (role) {
      case 'admin':
        return theme.colors.status.error;
      case 'tutor':
        return theme.colors.brand.primary;
      case 'viewer':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        background: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <SecurityIcon sx={{ color: theme.colors.brand.primary, fontSize: 24 }} />
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            flexGrow: 1,
          }}
        >
          Authorization Codes Information
        </Typography>
        <Button
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            color: theme.colors.brand.primary,
            textTransform: 'none',
          }}
        >
          {expanded ? 'Hide' : 'Show'} Available Codes
        </Button>
      </Box>

      <Alert
        severity="info"
        sx={{
          mb: 2,
          backgroundColor: `${theme.colors.brand.primary}15`,
          border: `1px solid ${theme.colors.brand.primary}30`,
          '& .MuiAlert-icon': {
            color: theme.colors.brand.primary,
          },
        }}
      >
        <Typography variant="body2">
          <strong>Multi-User System Active:</strong> New users must provide a valid authorization
          code during registration. Existing users can continue logging in normally. Share these
          codes with authorized tutors.
        </Typography>
      </Alert>

      {copiedCode && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Code "{copiedCode}" copied to clipboard!
        </Alert>
      )}

      <Collapse in={expanded}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Authorization Code
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Role
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Description
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Permissions
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authorizationCodes.map((auth, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        backgroundColor: theme.colors.background.tertiary,
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px',
                        fontSize: '12px',
                        display: 'inline-block',
                      }}
                    >
                      {auth.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={auth.role}
                      size="small"
                      sx={{
                        backgroundColor: getRoleColor(auth.role),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '11px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '13px' }}>
                      {auth.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '12px', color: theme.colors.text.secondary }}
                    >
                      {auth.permissions}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(auth.code)}
                      sx={{
                        color: theme.colors.brand.primary,
                        '&:hover': {
                          backgroundColor: `${theme.colors.brand.primary}15`,
                        },
                      }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: '8px',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1, color: theme.colors.text.primary }}
          >
            How to Use:
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
            1. <strong>For business owners/partners:</strong> Use MASTER-TUTOR-2024,
            ADMIN-PARTNER-001, or ADMIN-MANAGER-001 for full admin access
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
            2. <strong>For assistant tutors:</strong> Share TUTOR-ASSIST-001/002/003 codes for
            standard tutoring features
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
            3. <strong>For view-only access:</strong> Use TUTOR-VIEW-001 for students and reports
            viewing only
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            4. <strong>For existing users:</strong> They can continue logging in normally without
            codes
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AuthorizationInfo;
