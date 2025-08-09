import { useEffect, useState } from 'react';
import firebaseService from '../services/firebaseService';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  TextField,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useTheme } from '../theme/ThemeContext';
import SlidingSessionTypeSelector from '../components/SlidingSessionTypeSelector';

const SESSION_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'in_person_class', label: 'In-Person Class' },
  { value: 'in_person_one_on_one', label: 'In-Person One-on-One' },
];

const DURATION_OPTIONS = [
  { value: 1, label: '1 hr' },
  { value: 1.5, label: '1.5 hrs' },
  { value: 2, label: '2 hrs' },
  { value: 2.5, label: '2.5 hrs' },
  { value: 3, label: '3 hrs' },
  { value: 3.5, label: '3.5 hrs' },
  { value: 4, label: '4 hrs' },
];

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Load students once
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await firebaseService.getStudents();
        setStudents(studentsData);

        if (studentsData.length === 0) {
          setError('No students found. Please add students first.');
        } else {
          setError(''); // Clear any previous errors
        }
      } catch (error) {
        console.error('❌ Error loading students:', error);
        setError('Failed to load students. Please refresh the page.');
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Handle checkbox toggle
  const handleCheck = studentId => e => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [SESSION_TYPES[tab].value]: {
          ...((prev[studentId] && prev[studentId][SESSION_TYPES[tab].value]) || {}),
          attended: e.target.checked,
        },
      },
    }));
  };

  // Handle duration select
  const handleDuration = studentId => e => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [SESSION_TYPES[tab].value]: {
          ...((prev[studentId] && prev[studentId][SESSION_TYPES[tab].value]) || {}),
          duration: e.target.value,
          attended: !!(prev[studentId] && prev[studentId][SESSION_TYPES[tab].value]?.attended),
        },
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    let anySaved = false;
    let savedCount = 0;
    try {
      for (const student of students) {
        const entry = attendance[student.id] && attendance[student.id][SESSION_TYPES[tab].value];
        if (entry && entry.attended && entry.duration) {
          const attendanceRecord = {
            studentId: student.id,
            date: new Date(selectedDate),
            sessionType: SESSION_TYPES[tab].value,
            duration: parseFloat(entry.duration),
            status: 'present',
          };

          await firebaseService.addAttendanceRecord(attendanceRecord);
          anySaved = true;
          savedCount++;
        }
      }
      if (!anySaved) {
        setError('No students selected with duration for attendance.');
      } else {
        setAttendance({});
        setError(
          `✅ Successfully saved attendance for ${savedCount} student${savedCount > 1 ? 's' : ''}!`
        );
      }
    } catch (err) {
      console.error('❌ Error saving attendance:', err);
      setError('Failed to save attendance. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        p: 3,
        // Force remove any backdrop filters or overlays
        backdropFilter: 'none !important',
        filter: 'none !important',
        '&::before': {
          display: 'none !important',
        },
        '&::after': {
          display: 'none !important',
        },
      }}
    >
      <Box maxWidth={850} mx="auto">
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: 'none',
            borderRadius: '16px',
            // Force clear any overlays
            backdropFilter: 'none !important',
            filter: 'none !important',
            '&::before': {
              display: 'none !important',
            },
            '&::after': {
              display: 'none !important',
            },
          }}
        >
          <Typography
            variant="h5"
            mb={2}
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
            }}
          >
            Attendance Entry
          </Typography>



          {error && (
            <Alert severity={error.includes('Failed') ? 'error' : 'info'} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {/* Mobile: Sliding Session Type Selector, Desktop: Standard Tabs */}
          {isMobile ? (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.primary,
                  fontWeight: 600,
                  mb: 2,
                  textAlign: 'center',
                  fontSize: '16px',
                }}
              >
                Session Type
              </Typography>
              <SlidingSessionTypeSelector
                value={SESSION_TYPES[tab].value}
                onChange={(value) => {
                  const newTab = SESSION_TYPES.findIndex(type => type.value === value);
                  setTab(newTab);
                }}
                options={SESSION_TYPES}
                disabled={loading}
              />
            </Box>
          ) : (
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  color: theme.colors.text.secondary,
                  '&.Mui-selected': {
                    color: theme.colors.brand.primary,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.colors.brand.primary,
                },
              }}
            >
              {SESSION_TYPES.map(type => (
                <Tab key={type.value} label={type.label} />
              ))}
            </Tabs>
          )}
          <TextField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.colors.brand.primary,
                color: '#000000',
                '& fieldset': {
                  borderColor: theme.colors.brand.primary,
                },
                '&:hover fieldset': {
                  borderColor: theme.colors.brand.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.colors.brand.primary,
                },
              },
              '& .MuiInputLabel-root': {
                color: '#000000',
                fontWeight: 600,
                '&.MuiInputLabel-shrink': {
                  color: '#000000',
                },
              },
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Present?
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Student Name
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Duration
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ textAlign: 'center', color: theme.colors.text.secondary, py: 4 }}
                  >
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{ textAlign: 'center', color: theme.colors.text.secondary, py: 4 }}
                  >
                    {error || 'No students found. Please add students first.'}
                  </TableCell>
                </TableRow>
              ) : (
                students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={
                          !!(
                            attendance[student.id] &&
                            attendance[student.id][SESSION_TYPES[tab].value]?.attended
                          )
                        }
                        onChange={handleCheck(student.id)}
                        sx={{
                          color: theme.colors.brand.primary,
                          backgroundColor: theme.colors.brand.primary,
                          borderRadius: '4px',
                          '&.Mui-checked': {
                            color: '#000000',
                            backgroundColor: theme.colors.brand.primary,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary }}>{student.name}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel
                          id={`duration-label-${student.id}`}
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
                          labelId={`duration-label-${student.id}`}
                          value={
                            (attendance[student.id] &&
                              attendance[student.id][SESSION_TYPES[tab].value]?.duration) ||
                            ''
                          }
                          label="Duration"
                          onChange={handleDuration(student.id)}
                          disabled={
                            !(
                              attendance[student.id] &&
                              attendance[student.id][SESSION_TYPES[tab].value]?.attended
                            )
                          }
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
                            '&.Mui-disabled': {
                              backgroundColor: theme.colors.background.secondary,
                              color: theme.colors.text.secondary,
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: theme.colors.brand.primary,
              '&:hover': {
                backgroundColor: theme.colors.brand.secondary,
              },
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default AttendancePage;
