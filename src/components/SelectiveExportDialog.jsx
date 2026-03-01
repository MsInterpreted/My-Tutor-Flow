import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  SelectAll as SelectAllIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const SelectiveExportDialog = ({
  open,
  onClose,
  students = [],
  onExport,
  title = 'Select Students to Export',
}) => {
  const theme = useTheme();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search term
  const filteredStudents = students.filter(
    student =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade?.toString().includes(searchTerm)
  );

  const handleToggleStudent = studentId => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
  };

  const handleExport = () => {
    const selectedStudentData = students.filter(student => selectedStudents.includes(student.id));
    onExport(selectedStudentData);
    onClose();
    setSelectedStudents([]);
    setSearchTerm('');
  };

  const handleClose = () => {
    onClose();
    setSelectedStudents([]);
    setSearchTerm('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 600,
          fontSize: '20px',
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        {/* Search and Controls */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search students..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.colors.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: theme.colors.background.tertiary,
                border: 'none',
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          />

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`${selectedStudents.length} selected`}
                color="primary"
                size="small"
                sx={{
                  backgroundColor: theme.colors.brand.primary,
                  color: 'white',
                }}
              />
              <Chip
                label={`${filteredStudents.length} total`}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: theme.colors.text.secondary,
                  color: theme.colors.text.secondary,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<SelectAllIcon />}
                onClick={handleSelectAll}
                sx={{
                  color: theme.colors.brand.primary,
                  textTransform: 'none',
                }}
              >
                {selectedStudents.length === filteredStudents.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={() => setSelectedStudents([])}
                sx={{
                  color: theme.colors.text.secondary,
                  textTransform: 'none',
                }}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderColor: theme.colors.background.tertiary }} />

        {/* Student List */}
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredStudents.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                {searchTerm ? 'No students found matching your search.' : 'No students available.'}
              </Typography>
            </Box>
          ) : (
            filteredStudents.map(student => (
              <ListItem
                key={student.id}
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  backgroundColor: selectedStudents.includes(student.id)
                    ? `${theme.colors.brand.primary}15`
                    : 'transparent',
                  border: selectedStudents.includes(student.id)
                    ? `1px solid ${theme.colors.brand.primary}30`
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.colors.background.tertiary,
                  },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleToggleStudent(student.id)}
                    sx={{
                      color: theme.colors.brand.primary,
                      '&.Mui-checked': {
                        color: theme.colors.brand.primary,
                      },
                    }}
                  />
                </ListItemIcon>
                <ListItemIcon>
                  <PersonIcon sx={{ color: theme.colors.text.secondary }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: theme.colors.text.primary,
                        fontWeight: 500,
                      }}
                    >
                      {student.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      sx={{
                        color: theme.colors.text.secondary,
                        fontSize: '14px',
                      }}
                    >
                      {student.email} • Grade {student.grade}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: theme.colors.text.secondary,
            textTransform: 'none',
            borderRadius: '8px',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          disabled={selectedStudents.length === 0}
          startIcon={<DownloadIcon />}
          variant="contained"
          sx={{
            backgroundColor: theme.colors.brand.primary,
            color: 'white',
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            '&:hover': {
              backgroundColor: theme.colors.brand.secondary,
            },
            '&:disabled': {
              backgroundColor: theme.colors.background.tertiary,
              color: theme.colors.text.secondary,
            },
          }}
        >
          Export {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectiveExportDialog;
