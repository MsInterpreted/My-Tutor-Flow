import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  Computer as OnlineIcon,
  School as ClassIcon,
  Person as OneOnOneIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { formatCurrency } from '../utils/helpers';
import firebaseService from '../services/firebaseService';

export default function RateConfiguration() {
  const theme = useTheme();
  const [rates, setRates] = useState({
    online: 25,
    in_person_class: 30,
    in_person_one_on_one: 40,
  });
  const [customRatesEnabled, setCustomRatesEnabled] = useState(false);
  const [students, setStudents] = useState([]);
  const [customRates, setCustomRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [newCustomRate, setNewCustomRate] = useState({
    studentId: '',
    sessionType: 'online',
    rate: 0,
  });

  useEffect(() => {
    loadRates();
    loadStudents();
    loadCustomRates();
  }, []);

  const loadRates = async () => {
    try {
      // In a real app, this would load from Firebase
      // For now, using default rates
      setRates({
        online: 25,
        in_person_class: 30,
        in_person_one_on_one: 40,
      });
    } catch (error) {
      console.error('Error loading rates:', error);
      setError('Failed to load current rates');
    }
  };

  const loadStudents = async () => {
    try {
      const studentsData = await firebaseService.getStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadCustomRates = async () => {
    try {
      // In a real app, this would load custom rates from Firebase
      // For now, using mock data
      setCustomRates([
        {
          id: '1',
          studentId: 'student1',
          studentName: 'John Doe',
          sessionType: 'online',
          rate: 30,
        },
        {
          id: '2',
          studentId: 'student2',
          studentName: 'Jane Smith',
          sessionType: 'in_person_one_on_one',
          rate: 50,
        },
      ]);
    } catch (error) {
      console.error('Error loading custom rates:', error);
    }
  };

  const handleRateChange = (sessionType, value) => {
    const numericValue = parseFloat(value) || 0;
    setRates(prev => ({
      ...prev,
      [sessionType]: numericValue,
    }));
  };

  const saveRates = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // In a real app, this would save to Firebase
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving rates:', error);
      setError('Failed to save rates');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setRates({
      online: 25,
      in_person_class: 30,
      in_person_one_on_one: 40,
    });
  };

  const handleAddCustomRate = () => {
    setEditingRate(null);
    setNewCustomRate({
      studentId: '',
      sessionType: 'online',
      rate: 0,
    });
    setDialogOpen(true);
  };

  const handleEditCustomRate = rate => {
    setEditingRate(rate);
    setNewCustomRate({
      studentId: rate.studentId,
      sessionType: rate.sessionType,
      rate: rate.rate,
    });
    setDialogOpen(true);
  };

  const handleSaveCustomRate = async () => {
    try {
      if (editingRate) {
        // Update existing rate
        setCustomRates(prev =>
          prev.map(rate =>
            rate.id === editingRate.id
              ? {
                  ...rate,
                  ...newCustomRate,
                  studentName: students.find(s => s.id === newCustomRate.studentId)?.name,
                }
              : rate
          )
        );
      } else {
        // Add new rate
        const newRate = {
          id: Date.now().toString(),
          ...newCustomRate,
          studentName: students.find(s => s.id === newCustomRate.studentId)?.name,
        };
        setCustomRates(prev => [...prev, newRate]);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving custom rate:', error);
      setError('Failed to save custom rate');
    }
  };

  const handleDeleteCustomRate = rateId => {
    setCustomRates(prev => prev.filter(rate => rate.id !== rateId));
  };

  const getSessionTypeLabel = type => {
    const labels = {
      online: 'Online Session',
      in_person_class: 'In-Person Class',
      in_person_one_on_one: 'One-on-One',
    };
    return labels[type] || type;
  };

  const RateCard = ({ title, sessionType, icon, description, color }) => (
    <Card
      sx={{
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        borderRadius: '16px',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '8px',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>

        <TextField
          label="Hourly Rate"
          type="number"
          value={rates[sessionType]}
          onChange={e => handleRateChange(sessionType, e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
              '&:hover fieldset': {
                borderColor: color,
              },
              '&.Mui-focused fieldset': {
                borderColor: color,
              },
            },
          }}
        />

        <Box mt={2} p={2} sx={{ backgroundColor: `${color}10`, borderRadius: '8px' }}>
          <Typography variant="body2" sx={{ color: theme.colors.text.primary }}>
            <strong>Current Rate:</strong> {formatCurrency(rates[sessionType])}/hour
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: theme.shadows.card,
          borderRadius: '16px',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            mb: 1,
          }}
        >
          Rate Configuration
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.colors.text.secondary,
            mb: 3,
          }}
        >
          Set hourly rates for different session types. These rates will be used when generating
          invoices from attendance data.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Rates saved successfully!
          </Alert>
        )}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <RateCard
              title="Online Sessions"
              sessionType="online"
              icon={<OnlineIcon sx={{ color: '#2196F3' }} />}
              description="Virtual tutoring sessions"
              color="#2196F3"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RateCard
              title="In-Person Class"
              sessionType="in_person_class"
              icon={<ClassIcon sx={{ color: '#4CAF50' }} />}
              description="Group classroom sessions"
              color="#4CAF50"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RateCard
              title="One-on-One"
              sessionType="in_person_one_on_one"
              icon={<OneOnOneIcon sx={{ color: '#FF9800' }} />}
              description="Individual tutoring sessions"
              color="#FF9800"
            />
          </Grid>
        </Grid>

        <Divider
          sx={{
            mb: 3,
            borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        />

        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={customRatesEnabled}
                onChange={e => setCustomRatesEnabled(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                  Enable Custom Rates per Student
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  Allow different rates for individual students
                </Typography>
              </Box>
            }
          />
        </Box>

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={resetToDefaults}
            sx={{
              borderColor: theme.colors.text.secondary,
              color: theme.colors.text.secondary,
              '&:hover': {
                borderColor: theme.colors.text.primary,
                color: theme.colors.text.primary,
              },
            }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveRates}
            disabled={loading}
            sx={{
              backgroundColor: theme.colors.brand.primary,
              color: '#000000',
              '&:hover': {
                backgroundColor: theme.colors.brand.primary,
                opacity: 0.8,
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Rates'}
          </Button>
        </Box>
      </Paper>

      {/* Custom Rates Section */}
      {customRatesEnabled && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: theme.shadows.card,
            borderRadius: '16px',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
              }}
            >
              Custom Student Rates
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCustomRate}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000000',
                '&:hover': {
                  backgroundColor: theme.colors.brand.primary,
                  opacity: 0.8,
                },
              }}
            >
              Add Custom Rate
            </Button>
          </Box>

          {customRates.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                      Student
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                      Session Type
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                      Custom Rate
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customRates.map(rate => (
                    <TableRow key={rate.id}>
                      <TableCell sx={{ color: theme.colors.text.secondary }}>
                        {rate.studentName}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.secondary }}>
                        {getSessionTypeLabel(rate.sessionType)}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.secondary }}>
                        {formatCurrency(rate.rate)}/hour
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditCustomRate(rate)}
                          sx={{ color: theme.colors.brand.primary }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteCustomRate(rate.id)}
                          sx={{ color: '#F44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ color: theme.colors.text.secondary, textAlign: 'center', py: 4 }}>
              No custom rates configured. Click "Add Custom Rate" to get started.
            </Typography>
          )}
        </Paper>
      )}

      {/* Rate Summary */}
      <Paper
        sx={{
          p: 3,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: theme.shadows.card,
          borderRadius: '16px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            mb: 2,
          }}
        >
          Rate Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center" p={2}>
              <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 700 }}>
                {formatCurrency(rates.online)}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Online Sessions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center" p={2}>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                {formatCurrency(rates.in_person_class)}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                In-Person Class
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box textAlign="center" p={2}>
              <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700 }}>
                {formatCurrency(rates.in_person_one_on_one)}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                One-on-One
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Custom Rate Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: theme.colors.text.primary }}>
          {editingRate ? 'Edit Custom Rate' : 'Add Custom Rate'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  value={newCustomRate.studentId}
                  onChange={e => setNewCustomRate(prev => ({ ...prev, studentId: e.target.value }))}
                  label="Student"
                >
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Session Type</InputLabel>
                <Select
                  value={newCustomRate.sessionType}
                  onChange={e =>
                    setNewCustomRate(prev => ({ ...prev, sessionType: e.target.value }))
                  }
                  label="Session Type"
                >
                  <MenuItem value="online">Online Session</MenuItem>
                  <MenuItem value="in_person_class">In-Person Class</MenuItem>
                  <MenuItem value="in_person_one_on_one">One-on-One</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hourly Rate"
                type="number"
                value={newCustomRate.rate}
                onChange={e =>
                  setNewCustomRate(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))
                }
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveCustomRate}
            variant="contained"
            disabled={!newCustomRate.studentId || !newCustomRate.rate}
            sx={{
              backgroundColor: theme.colors.brand.primary,
              color: '#000000',
              '&:hover': {
                backgroundColor: theme.colors.brand.primary,
                opacity: 0.8,
              },
            }}
          >
            {editingRate ? 'Update' : 'Add'} Rate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
