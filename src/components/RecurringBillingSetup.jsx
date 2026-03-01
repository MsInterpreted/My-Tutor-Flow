import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Autocomplete,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Schedule,
  PlayArrow,
  Pause,
  CheckCircle,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';
import dayjs from 'dayjs';

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const AMOUNT_TYPES = [
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'from_rates', label: 'From Student Rates' },
];

const CURRENCIES = ['ZAR', 'USD', 'GBP', 'EUR', 'AED'];

const emptySchedule = {
  name: '',
  frequency: 'monthly',
  studentIds: [],
  amountType: 'fixed',
  fixedAmount: 0,
  currency: 'ZAR',
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: '',
  isActive: true,
  autoCharge: false,
  emailNotification: true,
  invoiceTemplate: {
    description: '',
    dueAfterDays: 30,
  },
};

export default function RecurringBillingSetup() {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [schedules, setSchedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({ ...emptySchedule });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedSchedules, fetchedStudents] = await Promise.all([
        firebaseService.getBillingSchedules(),
        firebaseService.getStudents(),
      ]);
      setSchedules(fetchedSchedules);
      setStudents(fetchedStudents);
    } catch (err) {
      console.error('Failed to load recurring billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSchedule(null);
    setFormData({ ...emptySchedule });
    setDialogOpen(true);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      name: schedule.name || '',
      frequency: schedule.frequency || 'monthly',
      studentIds: schedule.studentIds || [],
      amountType: schedule.amountType || 'fixed',
      fixedAmount: schedule.fixedAmount || 0,
      currency: schedule.currency || 'ZAR',
      startDate: schedule.startDate ? dayjs(schedule.startDate).format('YYYY-MM-DD') : '',
      endDate: schedule.endDate ? dayjs(schedule.endDate).format('YYYY-MM-DD') : '',
      isActive: schedule.isActive ?? true,
      autoCharge: schedule.autoCharge ?? false,
      emailNotification: schedule.emailNotification ?? true,
      invoiceTemplate: {
        description: schedule.invoiceTemplate?.description || '',
        dueAfterDays: schedule.invoiceTemplate?.dueAfterDays || 30,
      },
    });
    setDialogOpen(true);
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await firebaseService.deleteBillingSchedule(scheduleId);
      loadData();
    } catch (err) {
      setError('Failed to delete schedule.');
    }
  };

  const handleToggleActive = async (schedule) => {
    try {
      await firebaseService.updateBillingSchedule(schedule.id, {
        isActive: !schedule.isActive,
      });
      loadData();
    } catch (err) {
      setError('Failed to update schedule.');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Schedule name is required.');
      return;
    }
    if (formData.studentIds.length === 0) {
      setError('Select at least one student.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const scheduleData = {
        ...formData,
        fixedAmount: parseFloat(formData.fixedAmount) || 0,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        nextRunDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      };

      if (editingSchedule) {
        await firebaseService.updateBillingSchedule(editingSchedule.id, scheduleData);
      } else {
        await firebaseService.createBillingSchedule(scheduleData);
      }

      setDialogOpen(false);
      loadData();
    } catch (err) {
      setError('Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const cardSx = {
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: theme.shadows.card,
    borderRadius: '16px',
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: theme.colors.text.primary,
      '& fieldset': { borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
    },
    '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: theme.colors.brand.primary }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
          Recurring Billing Schedules
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{
            backgroundColor: theme.colors.brand.primary,
            color: '#000',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            minHeight: isMobile ? '48px' : 'auto',
            width: isMobile ? '100%' : 'auto',
            touchAction: 'manipulation',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Create Schedule
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

      {/* Schedules List */}
      {schedules.length === 0 ? (
        <Paper sx={{ ...cardSx, p: 4, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 48, color: theme.colors.text.secondary, mb: 2 }} />
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
            No Recurring Schedules
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
            Create a billing schedule to automatically generate invoices for your students.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {schedules.map(schedule => (
            <Grid item xs={12} md={6} key={schedule.id}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1} mr={1}>
                      <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                        {schedule.name}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Chip
                        label={schedule.isActive ? 'Active' : 'Paused'}
                        size="small"
                        sx={{
                          backgroundColor: schedule.isActive
                            ? (theme.colors.status?.success || '#4CAF50') + '20'
                            : (theme.colors.status?.error || '#F44336') + '20',
                          color: schedule.isActive
                            ? theme.colors.status?.success || '#4CAF50'
                            : theme.colors.status?.error || '#F44336',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      Frequency: <strong style={{ color: theme.colors.text.primary }}>{schedule.frequency}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      Students: <strong style={{ color: theme.colors.text.primary }}>{schedule.studentIds?.length || 0}</strong>
                    </Typography>
                    {schedule.fixedAmount > 0 && (
                      <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                        Amount: <strong style={{ color: theme.colors.text.primary }}>{schedule.currency} {schedule.fixedAmount}</strong>
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      Next Run: <strong style={{ color: theme.colors.text.primary }}>
                        {schedule.nextRunDate ? dayjs(schedule.nextRunDate).format('DD MMM YYYY') : 'Not scheduled'}
                      </strong>
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}>
                    <Tooltip title={schedule.isActive ? 'Pause' : 'Activate'}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(schedule)}
                        sx={{ color: schedule.isActive ? '#FF9800' : '#4CAF50' }}
                      >
                        {schedule.isActive ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEdit(schedule)} sx={{ color: theme.colors.brand.primary }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(schedule.id)} sx={{ color: '#F44336' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            backgroundColor: theme.colors.background.secondary,
            borderRadius: isMobile ? 0 : '16px',
            border: isMobile ? 'none' : `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
          {editingSchedule ? 'Edit Schedule' : 'Create Billing Schedule'}
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Schedule Name"
            size="small"
            fullWidth
            value={formData.name}
            onChange={(e) => updateForm('name', e.target.value)}
            sx={inputSx}
            placeholder="e.g. Monthly Billing - All Students"
          />

          <Autocomplete
            multiple
            options={students}
            getOptionLabel={(option) => option.name || option.firstName || option.id}
            value={students.filter(s => formData.studentIds.includes(s.id))}
            onChange={(_, newVal) => updateForm('studentIds', newVal.map(s => s.id))}
            renderInput={(params) => (
              <TextField {...params} label="Students" size="small" sx={inputSx} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name || option.firstName || option.id}
                  size="small"
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />

          <FormControl fullWidth size="small" sx={inputSx}>
            <InputLabel>Frequency</InputLabel>
            <Select value={formData.frequency} label="Frequency" onChange={(e) => updateForm('frequency', e.target.value)}>
              {FREQUENCIES.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={inputSx}>
            <InputLabel>Amount Type</InputLabel>
            <Select value={formData.amountType} label="Amount Type" onChange={(e) => updateForm('amountType', e.target.value)}>
              {AMOUNT_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </Select>
          </FormControl>

          {formData.amountType === 'fixed' && (
            <Box display="flex" gap={2}>
              <FormControl size="small" sx={{ ...inputSx, minWidth: 100 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={formData.currency} label="Currency" onChange={(e) => updateForm('currency', e.target.value)}>
                  {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Amount"
                type="number"
                size="small"
                fullWidth
                value={formData.fixedAmount}
                onChange={(e) => updateForm('fixedAmount', e.target.value)}
                sx={inputSx}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Box>
          )}

          <Box display="flex" gap={2} flexDirection={isMobile ? 'column' : 'row'}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              value={formData.startDate}
              onChange={(e) => updateForm('startDate', e.target.value)}
              sx={inputSx}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date (Optional)"
              type="date"
              size="small"
              fullWidth
              value={formData.endDate}
              onChange={(e) => updateForm('endDate', e.target.value)}
              sx={inputSx}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            label="Invoice Description"
            size="small"
            fullWidth
            value={formData.invoiceTemplate.description}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              invoiceTemplate: { ...prev.invoiceTemplate, description: e.target.value },
            }))}
            sx={inputSx}
            placeholder="e.g. Tutoring fees for {month}"
          />

          <TextField
            label="Due After (Days)"
            type="number"
            size="small"
            fullWidth
            value={formData.invoiceTemplate.dueAfterDays}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              invoiceTemplate: { ...prev.invoiceTemplate, dueAfterDays: parseInt(e.target.value) || 30 },
            }))}
            sx={inputSx}
            inputProps={{ min: 1, max: 90 }}
          />

          <FormControlLabel
            control={<Switch checked={formData.autoCharge} onChange={(e) => updateForm('autoCharge', e.target.checked)} />}
            label="Auto-charge (requires saved payment method)"
            sx={{ color: theme.colors.text.primary }}
          />

          <FormControlLabel
            control={<Switch checked={formData.emailNotification} onChange={(e) => updateForm('emailNotification', e.target.checked)} />}
            label="Send email notification on invoice creation"
            sx={{ color: theme.colors.text.primary }}
          />

          {error && <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={saving}
            sx={{ color: theme.colors.text.secondary, textTransform: 'none', width: isMobile ? '100%' : 'auto' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <CheckCircle />}
            sx={{
              backgroundColor: theme.colors.brand.primary,
              color: '#000',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '48px' : '36px',
              '&:hover': { opacity: 0.8 },
            }}
          >
            {saving ? 'Saving...' : editingSchedule ? 'Update Schedule' : 'Create Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
