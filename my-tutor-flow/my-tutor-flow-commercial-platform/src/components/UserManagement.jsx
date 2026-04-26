import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import {
  generateAuthorizationCode,
  getAuthorizationCodes,
  USER_ROLES,
} from '../services/authorizationService';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const UserManagement = ({ currentUser, userProfile }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [authCodes, setAuthCodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCodeData, setNewCodeData] = useState({
    role: 'tutor',
    permissions: ['students', 'attendance', 'reports', 'dashboard'],
    description: '',
    maxUsage: null,
    expiresAt: null,
  });

  // Check if user has admin permissions
  const isAdmin = userProfile?.roleInfo?.canManageUsers;

  // Early return if no current user
  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
          Authentication Required
        </Typography>
        <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
          Please log in to access user management features.
        </Typography>
      </Box>
    );
  }

  useEffect(() => {
    if (isAdmin && currentUser) {
      fetchAuthCodes();
      fetchUsers();
    }
  }, [isAdmin, currentUser]);

  const fetchAuthCodes = async () => {
    if (!currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      const codes = await getAuthorizationCodes(currentUser.uid);
      setAuthCodes(codes);
    } catch (error) {
      setError('Failed to fetch authorization codes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'userProfiles');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const usersList = [];
      querySnapshot.forEach(doc => {
        usersList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleGenerateCode = async () => {
    if (!currentUser?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const newCode = await generateAuthorizationCode(currentUser.uid, newCodeData);
      setSuccess(`New authorization code generated: ${newCode}`);

      // Reset form
      setNewCodeData({
        role: 'tutor',
        permissions: ['students', 'attendance', 'reports', 'dashboard'],
        description: '',
        maxUsage: null,
        expiresAt: null,
      });

      setDialogOpen(false);
      fetchAuthCodes();
    } catch (error) {
      setError('Failed to generate code: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setSuccess('Code copied to clipboard!');
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

  const getStatusColor = (isActive, expiresAt) => {
    if (!isActive) return theme.colors.text.secondary;
    if (expiresAt && new Date(expiresAt.toDate ? expiresAt.toDate() : expiresAt) < new Date()) {
      return theme.colors.status.error;
    }
    return theme.colors.status.success;
  };

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <SecurityIcon sx={{ fontSize: 64, color: theme.colors.text.secondary, mb: 2 }} />
        <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
          Access Denied
        </Typography>
        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
          You don't have permission to access user management features.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 1,
        }}
      >
        User Management
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.colors.text.secondary,
          mb: 4,
        }}
      >
        Manage tutor access and authorization codes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            color: theme.colors.text.secondary,
            '&.Mui-selected': {
              color: theme.colors.brand.primary,
            },
          },
        }}
      >
        <Tab label="Authorization Codes" icon={<SecurityIcon />} />
        <Tab label="Active Users" icon={<PeopleIcon />} />
      </Tabs>

      {activeTab === 0 && (
        <AuthorizationCodesTab
          authCodes={authCodes}
          onGenerateCode={() => setDialogOpen(true)}
          onCopyCode={copyToClipboard}
          getRoleColor={getRoleColor}
          getStatusColor={getStatusColor}
          theme={theme}
          loading={loading}
        />
      )}

      {activeTab === 1 && (
        <ActiveUsersTab users={users} getRoleColor={getRoleColor} theme={theme} />
      )}

      {/* Generate Code Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: theme.colors.background.secondary,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.colors.text.primary }}>
          Generate New Authorization Code
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newCodeData.role}
                  onChange={e => setNewCodeData(prev => ({ ...prev, role: e.target.value }))}
                >
                  <MenuItem value="tutor">Tutor</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newCodeData.description}
                onChange={e => setNewCodeData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Assistant Tutor - Math Department"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Usage (Optional)"
                type="number"
                value={newCodeData.maxUsage || ''}
                onChange={e =>
                  setNewCodeData(prev => ({
                    ...prev,
                    maxUsage: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                placeholder="Leave empty for unlimited"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expires At (Optional)"
                type="date"
                value={newCodeData.expiresAt || ''}
                onChange={e =>
                  setNewCodeData(prev => ({
                    ...prev,
                    expiresAt: e.target.value ? new Date(e.target.value) : null,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleGenerateCode}
            disabled={loading}
            sx={{ backgroundColor: theme.colors.brand.primary }}
          >
            Generate Code
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Authorization Codes Tab Component
const AuthorizationCodesTab = ({
  authCodes,
  onGenerateCode,
  onCopyCode,
  getRoleColor,
  getStatusColor,
  theme,
  loading,
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
          Authorization Codes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onGenerateCode}
          disabled={loading}
          sx={{ backgroundColor: theme.colors.brand.primary }}
        >
          Generate New Code
        </Button>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '16px',
          background: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authCodes.map(code => (
              <TableRow key={code.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        backgroundColor: theme.colors.background.tertiary,
                        px: 1,
                        py: 0.5,
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {code.code}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => onCopyCode(code.code)}
                      sx={{ color: theme.colors.text.secondary }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={code.role}
                    size="small"
                    sx={{
                      backgroundColor: getRoleColor(code.role),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{code.description || 'No description'}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      code.isActive
                        ? code.expiresAt &&
                          new Date(
                            code.expiresAt.toDate ? code.expiresAt.toDate() : code.expiresAt
                          ) < new Date()
                          ? 'Expired'
                          : 'Active'
                        : 'Inactive'
                    }
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(code.isActive, code.expiresAt),
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    {code.createdAt
                      ? new Date(
                          code.createdAt.toDate ? code.createdAt.toDate() : code.createdAt
                        ).toLocaleDateString()
                      : 'System'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" sx={{ color: theme.colors.text.secondary }}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  </Grid>
);

// Active Users Tab Component
const ActiveUsersTab = ({ users, getRoleColor, theme }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 3 }}>
        Active Users ({users.length})
      </Typography>
    </Grid>

    {users.map(user => (
      <Grid item xs={12} md={6} lg={4} key={user.id}>
        <Card
          sx={{
            borderRadius: '16px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: theme.shadows.card,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${getRoleColor(user.role)}, ${getRoleColor(user.role)}CC)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user.role === 'admin' ? (
                  <AdminIcon sx={{ color: 'white', fontSize: 24 }} />
                ) : (
                  <PeopleIcon sx={{ color: 'white', fontSize: 24 }} />
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  {user.displayName || `${user.firstName} ${user.lastName}` || user.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text.secondary,
                    fontSize: '14px',
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2, borderColor: theme.colors.background.tertiary }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                label={user.role}
                size="small"
                sx={{
                  backgroundColor: getRoleColor(user.role),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  fontSize: '12px',
                }}
              >
                Last login:{' '}
                {user.lastLogin
                  ? new Date(
                      user.lastLogin.toDate ? user.lastLogin.toDate() : user.lastLogin
                    ).toLocaleDateString()
                  : 'Never'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}

    {users.length === 0 && (
      <Grid item xs={12}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <PeopleIcon sx={{ fontSize: 64, color: theme.colors.text.secondary, mb: 2 }} />
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
            No Users Found
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            No users have registered yet.
          </Typography>
        </Box>
      </Grid>
    )}
  </Grid>
);

export default UserManagement;
