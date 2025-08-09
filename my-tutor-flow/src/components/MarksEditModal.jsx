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
  'Technical Drawing',
  'Social Studies (SS)',
  'Natural Science (NS)',
  'Life Orientation (LO)',
];

export default function MarksEditModal({
  open,
  mark,
  studentId,
  student,
  onClose,
  reload,
  setSnackbar,
}) {
  const theme = useTheme();
  const [editMark, setEditMark] = useState(mark || { term: '', subject: '', mark: '' });
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [customTerm, setCustomTerm] = useState('');
  const [isCustomTerm, setIsCustomTerm] = useState(false);
  const isEditing = Boolean(mark);

  useEffect(() => {
    setEditMark(mark || { term: '', subject: '', mark: '' });

    // Check if the current term is a custom term (not in predefined options)
    if (mark?.term) {
      const isPredefined = TERM_OPTIONS.some(option => option.value === mark.term);
      setIsCustomTerm(!isPredefined);
      if (!isPredefined) {
        setCustomTerm(mark.term);
      }
    }
  }, [mark]);

  // Set up student subjects when modal opens
  useEffect(() => {
    if (open) {
      let subjects = [];

      // First try to get subjects from the student prop (if passed)
      if (student?.subjects && Array.isArray(student.subjects) && student.subjects.length > 0) {
        subjects = student.subjects;
      }
      // If no subjects from prop, try to fetch from firebaseService
      else if (studentId) {
        const fetchStudentSubjects = async () => {
          try {
            const studentData = await firebaseService.getStudent(studentId);
            if (
              studentData?.subjects &&
              Array.isArray(studentData.subjects) &&
              studentData.subjects.length > 0
            ) {
              subjects = studentData.subjects;
            } else {
              // Use fallback subjects if student has no subjects defined
              subjects = FALLBACK_SUBJECTS;
            }
            setStudentSubjects(subjects);
          } catch (error) {
            console.error('Error fetching student subjects:', error);
            // Use fallback subjects on error
            setStudentSubjects(FALLBACK_SUBJECTS);
          }
        };
        fetchStudentSubjects();
        return; // Exit early since we're handling async
      }

      // If we have subjects from prop or no studentId, set them directly
      if (subjects.length === 0) {
        subjects = FALLBACK_SUBJECTS;
      }
      setStudentSubjects(subjects);
    }
  }, [open, student, studentId]);

  if (!open) return null;

  const handleSave = async () => {
    try {
      // Get the final term value (custom term if selected, otherwise the dropdown value)
      const finalTerm = isCustomTerm ? customTerm : editMark.term;

      const markData = {
        term: finalTerm,
        subject: editMark.subject,
        mark: Number(editMark.mark),
      };

      if (isEditing) {
        // Update existing mark using firebaseService
        await firebaseService.updateMarkForStudent(studentId, editMark.id, markData);
        setSnackbar({ open: true, message: 'Mark updated!', severity: 'success' });
      } else {
        // Add new mark using firebaseService
        await firebaseService.addMarkForStudent(studentId, markData);
        setSnackbar({ open: true, message: 'Mark added!', severity: 'success' });
      }
      onClose();
      reload();
    } catch (error) {
      console.error('Error saving mark:', error);
      setSnackbar({
        open: true,
        message: isEditing ? 'Failed to update mark.' : 'Failed to add mark.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await firebaseService.deleteMarkForStudent(studentId, editMark.id);
      setSnackbar({ open: true, message: 'Mark deleted.', severity: 'success' });
      onClose();
      reload();
    } catch (error) {
      console.error('Error deleting mark:', error);
      setSnackbar({ open: true, message: 'Failed to delete mark.', severity: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{isEditing ? 'Edit Mark' : 'Add New Mark'}</DialogTitle>
      <DialogContent dividers>
        {/* Term Selection */}
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
            value={isCustomTerm ? 'custom' : editMark.term || ''}
            onChange={e => {
              if (e.target.value === 'custom') {
                setIsCustomTerm(true);
                setEditMark(m => ({ ...m, term: customTerm }));
              } else {
                setIsCustomTerm(false);
                setEditMark(m => ({ ...m, term: e.target.value }));
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

        {/* Custom Term Input */}
        {isCustomTerm && (
          <TextField
            label="Custom Term"
            value={customTerm}
            onChange={e => {
              setCustomTerm(e.target.value);
              setEditMark(m => ({ ...m, term: e.target.value }));
            }}
            margin="normal"
            fullWidth
            placeholder="Enter custom term name"
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
        )}

        {/* Subject Selection */}
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
            value={editMark.subject || ''}
            onChange={e => setEditMark(m => ({ ...m, subject: e.target.value }))}
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
                <em>Loading subjects...</em>
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          label="Mark (%)"
          type="number"
          value={editMark.mark || ''}
          onChange={e => setEditMark(m => ({ ...m, mark: e.target.value }))}
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
      </DialogContent>
      <DialogActions>
        {isEditing && (
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {isEditing ? 'Save' : 'Add Mark'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
