import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Box,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
  Grid,
} from '@mui/material';
import SlidingSessionTypeSelector from './SlidingSessionTypeSelector';
import { useTheme } from '../theme/ThemeContext';
import { DURATION_OPTIONS, SESSION_TYPE_LABELS } from '../utils/constants';
import firebaseService from '../services/firebaseService';

export default function QuickAddAttendanceModal({
  open,
  onClose,
  students,
  reload,
  setSnackbar,
}) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    sessionType: 'online',
    duration: 1,
    status: 'present',
  });
  const [loading, setLoading] = useState(false);

  // Helper functions for billing rate display
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'ZAR': return 'R';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return 'R';
    }
  };

  const getStudentRate = (sessionType) => {
    const studentRates = selectedStudent?.billingRates;
    if (studentRates?.[sessionType]?.amount && studentRates[sessionType].amount.trim() !== '') {
      return studentRates[sessionType];
    }
    // Default rates
    const defaultRates = {
      online: { amount: '45', currency: 'ZAR' },
      in_person_class: { amount: '55', currency: 'ZAR' },
      in_person_one_on_one: { amount: '75', currency: 'ZAR' },
    };
    return defaultRates[sessionType] || { amount: '45', currency: 'ZAR' };
  };

  const calculateSessionCost = () => {
    if (!attendanceData.sessionType || !attendanceData.duration || !selectedStudent) return null;

    const rate = getStudentRate(attendanceData.sessionType);
    const hours = parseFloat(attendanceData.duration);
    const amount = parseFloat(rate.amount);

    if (isNaN(hours) || isNaN(amount)) return null;

    return {
      total: (hours * amount).toFixed(2),
      currency: rate.currency,
      rate: rate.amount,
      hours: hours,
    };
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedStudent(null);
      setAttendanceData({
        date: new Date().toISOString().split('T')[0],
        sessionType: 'online',
        duration: 1,
        status: 'present',
      });
    }
  }, [open]);

  const handleSave = async () => {
    if (!selectedStudent) {
      setSnackbar({
        open: true,
        message: 'Please select a student',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await firebaseService.addAttendanceRecord({
        studentId: selectedStudent.id,
        ...attendanceData,
        createdAt: new Date().toISOString(),
      });

      setSnackbar({
        open: true,
        message: 'Attendance added successfully!',
        severity: 'success',
      });
      onClose();
      if (reload) reload();
    } catch (error) {
      console.error('Error adding attendance:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add attendance. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? "sm" : "md"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          minHeight: isMobile ? 'auto' : '600px',
        }
      }}
    >
      <DialogTitle
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 600,
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          textAlign: 'center',
          pb: 1,
        }}
      >
        Quick Add Attendance
      </DialogTitle>
      <DialogContent dividers sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={isMobile ? 2 : 3}>
          {/* Student Selection */}
          <Grid item xs={12}>
            <Autocomplete
          options={students}
          getOptionLabel={(option) => 
            `${option.firstName || ''} ${option.lastName || ''}`.trim() || 
            option.name || 
            'Unnamed Student'
          }
          value={selectedStudent}
          onChange={(_, newValue) => setSelectedStudent(newValue)}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Student"
              placeholder="Search for a student..."
              sx={{
                '& .MuiInputLabel-root': {
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: theme.colors.brand.primary,
                  },
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.colors.brand.primary,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.colors.brand.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.colors.brand.primary,
                  },
                  '& input': {
                    color: theme.colors.text.primary,
                  },
                },
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <Box
                component="li"
                key={key}
                {...otherProps}
                sx={{
                  color: theme.colors.brand.primary,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: `${theme.colors.brand.primary}20`,
                  },
                  '&.Mui-focused': {
                    backgroundColor: `${theme.colors.brand.primary}30`,
                  },
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ color: theme.colors.brand.primary }}>
                    {`${option.firstName || ''} ${option.lastName || ''}`.trim() || 
                     option.name || 
                     'Unnamed Student'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Grade {option.grade} • {option.school}
                  </Typography>
                </Box>
              </Box>
            );
          }}
        />
          </Grid>

          {/* Date Field */}
          <Grid item xs={12} md={6}>
            <TextField
          label="Date"
          type="date"
          value={attendanceData.date}
          onChange={(e) => setAttendanceData(d => ({ ...d, date: e.target.value }))}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiInputLabel-root': {
              color: theme.colors.brand.primary,
              fontWeight: 600,
              '&.Mui-focused': {
                color: theme.colors.brand.primary,
              },
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.colors.brand.primary,
              },
              '&:hover fieldset': {
                borderColor: theme.colors.brand.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.colors.brand.primary,
              },
              '& input': {
                color: theme.colors.brand.primary,
                fontWeight: 500,
              },
            },
          }}
        />
          </Grid>

          {/* Session Type - Sliding Selector */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                  mb: 1,
                  fontSize: '14px',
                }}
              >
                Session Type
              </Typography>
              <SlidingSessionTypeSelector
                value={attendanceData.sessionType}
                onChange={(value) => setAttendanceData(d => ({ ...d, sessionType: value }))}
                options={Object.keys(SESSION_TYPE_LABELS).map(type => ({
                  value: type,
                  label: SESSION_TYPE_LABELS[type]
                }))}
                disabled={loading}
              />
            </Box>

            {/* Rate Information Display */}
            {selectedStudent && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: `${theme.colors.brand.primary}10`,
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.brand.primary}30`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.colors.text.secondary,
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  BILLING RATE
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.brand.primary,
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  {getCurrencySymbol(getStudentRate(attendanceData.sessionType).currency)}
                  {getStudentRate(attendanceData.sessionType).amount}/hour
                </Typography>

                {/* Session Cost Calculation */}
                {calculateSessionCost() && (
                  <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${theme.colors.brand.primary}20` }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'block',
                      }}
                    >
                      SESSION COST
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.brand.primary,
                        fontWeight: 700,
                        fontSize: '16px',
                      }}
                    >
                      {getCurrencySymbol(calculateSessionCost().currency)}
                      {calculateSessionCost().total}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontSize: '10px',
                      }}
                    >
                      ({calculateSessionCost().hours}h × {getCurrencySymbol(calculateSessionCost().currency)}{calculateSessionCost().rate})
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          {/* Duration */}
          <Grid item xs={12} md={6}>
            <FormControl margin="normal" fullWidth>
          <InputLabel
            sx={{
              color: theme.colors.brand.primary,
              fontWeight: 600,
              '&.Mui-focused': {
                color: theme.colors.brand.primary,
              },
            }}
          >
            Duration
          </InputLabel>
          <Select
            value={attendanceData.duration}
            onChange={(e) => setAttendanceData(d => ({ ...d, duration: e.target.value }))}
            label="Duration"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.brand.primary,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.brand.primary,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.brand.primary,
              },
              '& .MuiSelect-select': {
                color: theme.colors.text.primary,
              },
            }}
          >
            {DURATION_OPTIONS.map(opt => (
              <MenuItem 
                key={opt.value} 
                value={opt.value}
                sx={{
                  color: theme.colors.brand.primary,
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: `${theme.colors.brand.primary}20`,
                    color: theme.colors.brand.primary,
                  },
                  '&.Mui-selected': {
                    backgroundColor: `${theme.colors.brand.primary}30`,
                    color: theme.colors.brand.primary,
                    fontWeight: 600,
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: `${theme.colors.brand.primary}40`,
                  },
                }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl margin="normal" fullWidth>
          <InputLabel
            sx={{
              color: theme.colors.brand.primary,
              fontWeight: 600,
              '&.Mui-focused': {
                color: theme.colors.brand.primary,
              },
            }}
          >
            Status
          </InputLabel>
          <Select
            value={attendanceData.status}
            onChange={(e) => setAttendanceData(d => ({ ...d, status: e.target.value }))}
            label="Status"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.brand.primary,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.brand.primary,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.colors.brand.primary,
              },
              '& .MuiSelect-select': {
                color: theme.colors.text.primary,
              },
            }}
          >
            <MenuItem 
              value="present"
              sx={{
                color: theme.colors.brand.primary,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: `${theme.colors.brand.primary}20`,
                  color: theme.colors.brand.primary,
                },
                '&.Mui-selected': {
                  backgroundColor: `${theme.colors.brand.primary}30`,
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: `${theme.colors.brand.primary}40`,
                },
              }}
            >
              Present
            </MenuItem>
            <MenuItem 
              value="absent"
              sx={{
                color: theme.colors.brand.primary,
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: `${theme.colors.brand.primary}20`,
                  color: theme.colors.brand.primary,
                },
                '&.Mui-selected': {
                  backgroundColor: `${theme.colors.brand.primary}30`,
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: `${theme.colors.brand.primary}40`,
                },
              }}
            >
              Absent
            </MenuItem>
          </Select>
        </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: isMobile ? 2 : 3, gap: 2, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            minWidth: isMobile ? '100px' : '120px',
            height: isMobile ? '44px' : '40px',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !selectedStudent}
          sx={{
            backgroundColor: theme.colors.brand.primary,
            color: '#000000',
            fontWeight: 600,
            minWidth: isMobile ? '140px' : '160px',
            height: isMobile ? '44px' : '40px',
            boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)',
            '&:hover': {
              backgroundColor: theme.colors.brand.secondary,
              boxShadow: '0 4px 12px rgba(0, 212, 170, 0.4)',
            },
          }}
        >
          {loading ? 'Adding...' : 'Add Attendance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
