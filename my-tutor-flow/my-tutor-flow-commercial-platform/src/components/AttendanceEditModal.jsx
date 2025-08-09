import React, { useState, useEffect } from 'react';
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
import { DURATION_OPTIONS, SESSION_TYPE_LABELS } from '../utils/constants';
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';

export default function AttendanceEditModal({
  open,
  attendance,
  onClose,
  studentId,
  reload,
  setSnackbar,
}) {
  const theme = useTheme();
  const [editData, setEditData] = useState(
    attendance || {
      date: new Date().toISOString().split('T')[0],
      sessionType: 'online',
      duration: 1,
      status: 'present',
    }
  );
  const isEditing = Boolean(attendance);

  useEffect(() => {
    setEditData(
      attendance || {
        date: new Date().toISOString().split('T')[0],
        sessionType: 'online',
        duration: 1,
        status: 'present',
      }
    );
  }, [attendance]);

  if (!open) return null;

  const handleSave = async () => {
    try {
      if (isEditing) {
        // Update existing attendance
        await firebaseService.updateAttendanceRecord(editData.id, {
          date: new Date(editData.date),
          sessionType: editData.sessionType,
          duration: Number(editData.duration),
          status: editData.status,
        });
        setSnackbar({ open: true, message: 'Attendance updated!', severity: 'success' });
      } else {
        // Add new attendance
        await firebaseService.addAttendanceRecord({
          studentId: studentId,
          date: new Date(editData.date),
          sessionType: editData.sessionType,
          duration: Number(editData.duration),
          status: editData.status,
        });
        setSnackbar({ open: true, message: 'Attendance added!', severity: 'success' });
      }
      onClose();
      reload();
    } catch (error) {
      console.error('Error saving attendance:', error);
      setSnackbar({
        open: true,
        message: isEditing ? 'Failed to update attendance.' : 'Failed to add attendance.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await firebaseService.deleteAttendanceRecord(editData.id);
      setSnackbar({ open: true, message: 'Attendance deleted.', severity: 'success' });
      onClose();
      reload();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      setSnackbar({ open: true, message: 'Failed to delete attendance.', severity: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>{isEditing ? 'Edit Attendance' : 'Add New Attendance'}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Date"
          type="date"
          value={editData.date ? editData.date.slice(0, 10) : ''}
          onChange={e => setEditData(d => ({ ...d, date: e.target.value }))}
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
            Session Type
          </InputLabel>
          <Select
            value={editData.sessionType || ''}
            onChange={e => setEditData(d => ({ ...d, sessionType: e.target.value }))}
            label="Session Type"
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
            {Object.keys(SESSION_TYPE_LABELS).map(type => (
              <MenuItem
                key={type}
                value={type}
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
                {SESSION_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            value={editData.duration || ''}
            onChange={e => setEditData(d => ({ ...d, duration: e.target.value }))}
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
            value={editData.status || ''}
            onChange={e => setEditData(d => ({ ...d, status: e.target.value }))}
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
      </DialogContent>
      <DialogActions>
        {isEditing && (
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {isEditing ? 'Save' : 'Add Attendance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
