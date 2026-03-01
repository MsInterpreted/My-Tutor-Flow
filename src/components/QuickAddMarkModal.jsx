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
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';

// Define term options for different academic systems
const TERM_OPTIONS = [
  // 4-Term System
  { value: 'Term 1', label: 'Term 1' },
  { value: 'Term 2', label: 'Term 2' },
  { value: 'Term 3', label: 'Term 3' },
  { value: 'Term 4', label: 'Term 4' },
  // Semester System
  { value: 'Semester 1', label: 'Semester 1' },
  { value: 'Semester 2', label: 'Semester 2' },
  // Quarter System
  { value: 'Quarter 1', label: 'Quarter 1' },
  { value: 'Quarter 2', label: 'Quarter 2' },
  { value: 'Quarter 3', label: 'Quarter 3' },
  { value: 'Quarter 4', label: 'Quarter 4' },
  // Other common terms
  { value: 'Mid-term', label: 'Mid-term' },
  { value: 'Final', label: 'Final' },
  { value: 'Assessment', label: 'Assessment' },
];

// Fallback subjects when student has no subjects defined
const FALLBACK_SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'Foreign Language',
  'Art',
  'Music',
  'Physical Education',
  'Computer Science',
  'Economics',
  'Psychology',
];

export default function QuickAddMarkModal({
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
  const [markData, setMarkData] = useState({
    term: '',
    subject: '',
    mark: '',
  });
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [customTerm, setCustomTerm] = useState('');
  const [isCustomTerm, setIsCustomTerm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedStudent(null);
      setMarkData({
        term: '',
        subject: '',
        mark: '',
      });
      setStudentSubjects([]);
      setCustomTerm('');
      setIsCustomTerm(false);
    }
  }, [open]);

  // Load student subjects when student is selected
  useEffect(() => {
    if (selectedStudent) {
      const subjects = selectedStudent.subjects && selectedStudent.subjects.length > 0
        ? selectedStudent.subjects
        : FALLBACK_SUBJECTS;
      setStudentSubjects(subjects);
    } else {
      setStudentSubjects([]);
    }
  }, [selectedStudent]);

  const handleSave = async () => {
    if (!selectedStudent) {
      setSnackbar({
        open: true,
        message: 'Please select a student',
        severity: 'error',
      });
      return;
    }

    if (!markData.term || !markData.subject || !markData.mark) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await firebaseService.addMarkForStudent(selectedStudent.id, {
        ...markData,
        createdAt: new Date().toISOString(),
      });

      setSnackbar({
        open: true,
        message: 'Mark added successfully!',
        severity: 'success',
      });
      onClose();
      if (reload) reload();
    } catch (error) {
      console.error('Error adding mark:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add mark. Please try again.',
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
          minHeight: isMobile ? 'auto' : '650px',
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
        Quick Add Mark
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

          {/* Term Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
          <InputLabel
            sx={{
              color: theme.colors.brand.primary,
              fontWeight: 600,
              '&.Mui-focused': {
                color: theme.colors.brand.primary,
              },
            }}
          >
            Term
          </InputLabel>
          <Select
            value={isCustomTerm ? 'custom' : markData.term || ''}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomTerm(true);
                setMarkData(m => ({ ...m, term: customTerm }));
              } else {
                setIsCustomTerm(false);
                setMarkData(m => ({ ...m, term: e.target.value }));
              }
            }}
            label="Term"
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
            {TERM_OPTIONS.map(option => (
              <MenuItem 
                key={option.value} 
                value={option.value}
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
                {option.label}
              </MenuItem>
            ))}
            <MenuItem 
              value="custom"
              sx={{
                color: theme.colors.brand.primary,
                fontWeight: 500,
                fontStyle: 'italic',
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
              <em>Custom Term...</em>
            </MenuItem>
          </Select>
        </FormControl>
          </Grid>

          {/* Custom Term Input */}
          {isCustomTerm && (
            <Grid item xs={12} md={6}>
              <TextField
            label="Custom Term"
            value={customTerm}
            onChange={(e) => {
              setCustomTerm(e.target.value);
              setMarkData(m => ({ ...m, term: e.target.value }));
            }}
            margin="normal"
            fullWidth
            placeholder="Enter custom term name..."
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
          )}

          {/* Subject Selection */}
          <Grid item xs={12} md={isCustomTerm ? 12 : 6}>
            <FormControl fullWidth margin="normal">
          <InputLabel
            sx={{
              color: theme.colors.brand.primary,
              fontWeight: 600,
              '&.Mui-focused': {
                color: theme.colors.brand.primary,
              },
            }}
          >
            Subject
          </InputLabel>
          <Select
            value={markData.subject || ''}
            onChange={(e) => setMarkData(m => ({ ...m, subject: e.target.value }))}
            label="Subject"
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
            {studentSubjects.length > 0 ? (
              studentSubjects.map((subject, index) => (
                <MenuItem 
                  key={index} 
                  value={subject}
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
                  {subject}
                </MenuItem>
              ))
            ) : (
              <MenuItem 
                value="" 
                disabled
                sx={{
                  color: theme.colors.text.secondary,
                  fontStyle: 'italic',
                }}
              >
                <em>Select a student first...</em>
              </MenuItem>
            )}
          </Select>
        </FormControl>
          </Grid>

          {/* Mark Field */}
          <Grid item xs={12} md={6}>
            <TextField
          label="Mark (%)"
          type="number"
          value={markData.mark || ''}
          onChange={(e) => setMarkData(m => ({ ...m, mark: e.target.value }))}
          margin="normal"
          fullWidth
          slotProps={{
            htmlInput: { min: 0, max: 100 },
          }}
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
          disabled={loading || !selectedStudent || !markData.term || !markData.subject || !markData.mark}
          sx={{
            backgroundColor: theme.colors.brand.primary,
            color: '#000000',
            fontWeight: 600,
            minWidth: isMobile ? '120px' : '140px',
            height: isMobile ? '44px' : '40px',
            boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)',
            '&:hover': {
              backgroundColor: theme.colors.brand.secondary,
              boxShadow: '0 4px 12px rgba(0, 212, 170, 0.4)',
            },
          }}
        >
          {loading ? 'Adding...' : 'Add Mark'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
