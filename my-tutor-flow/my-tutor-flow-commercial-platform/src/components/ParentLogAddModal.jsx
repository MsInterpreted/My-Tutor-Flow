import React, { useState } from 'react';
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
import { PARENT_LOG_TYPES } from '../utils/constants';
import dayjs from 'dayjs';

export default function ParentLogAddModal({ open, studentId, onClose, reload, setSnackbar }) {
  const theme = useTheme();
  const [log, setLog] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    type: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!log.type || !log.notes) {
      setSnackbar({ open: true, message: 'Fill log type and notes.', severity: 'warning' });
      return;
    }

    if (!studentId) {
      setSnackbar({ open: true, message: 'Student ID is required.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await firebaseService.addParentLogForStudent(studentId, {
        ...log,
        date: log.date,
        type: log.type,
        notes: log.notes,
        createdAt: new Date().toISOString(),
      });

      setSnackbar({ open: true, message: 'Communication log added successfully!', severity: 'success' });
      onClose();
      reload();
      setLog({ date: dayjs().format('YYYY-MM-DD'), type: '', notes: '' });
    } catch (error) {
      console.error('Error adding parent log:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add communication log. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Add Parent Communication Log</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Date"
          type="date"
          value={log.date}
          onChange={e => setLog(l => ({ ...l, date: e.target.value }))}
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
            Type
          </InputLabel>
          <Select
            value={log.type}
            onChange={e => setLog(l => ({ ...l, type: e.target.value }))}
            label="Type"
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
            {PARENT_LOG_TYPES.map(opt => (
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
        <TextField
          label="Notes"
          value={log.notes}
          onChange={e => setLog(l => ({ ...l, notes: e.target.value }))}
          margin="normal"
          fullWidth
          multiline
          minRows={2}
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
              '& textarea': {
                color: theme.colors.brand.primary,
                fontWeight: 500,
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !log.type || !log.notes}
        >
          {loading ? 'Adding...' : 'Add Log'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
