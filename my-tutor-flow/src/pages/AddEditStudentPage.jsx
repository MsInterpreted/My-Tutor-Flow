import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Chip,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import {
  Computer as OnlineIcon,
  School as ClassIcon,
  Person as OneOnOneIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';
import { GRADE_LEVELS, SUBJECTS } from '../utils/constants';
import BillingRateInput from '../components/BillingRateInput';
import { StudentCurrencySelector } from '../components/CurrencySelector';
import { initializeStudentCurrency, updateStudentCurrency } from '../utils/studentCurrencyUtils';
import MobileContactPicker from '../components/MobileContactPicker';

const AddEditStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Student form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
    school: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    subjects: [],
    learningGoals: '',
    specialNeeds: '',
    notes: '',
    preferredSessionType: 'online',
    sessionDuration: 1,
    preferredTime: '',
    // Multi-Currency Support
    preferredCurrency: 'ZAR',
    initialAmount: 0,
    // Billing rates for different session types
    billingRates: {
      online: { amount: '', currency: 'ZAR' },
      in_person_class: { amount: '', currency: 'ZAR' },
      in_person_one_on_one: { amount: '', currency: 'ZAR' },
      intensive: { amount: '', currency: 'ZAR' },
      exam_prep: { amount: '', currency: 'ZAR' },
      homework: { amount: '', currency: 'ZAR' },
    },
    currencySettings: {
      displayFormat: 'symbol',
      showExchangeRate: false,
      lastCurrencyUpdate: new Date().toISOString(),
    },
    createdAt: null,
    updatedAt: null,
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchStudent();
    }
  }, [id, isEditing]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const student = await firebaseService.getStudent(id);

      if (student) {
        setFormData({
          ...formData,
          ...student,
          dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        });
      } else {
        setNotification({
          open: true,
          message: 'Student not found',
          severity: 'error',
        });
        navigate('/students');
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      setNotification({
        open: true,
        message: 'Error loading student data',
        severity: 'error',
      });
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleBillingRateChange = (sessionType, rateData) => {
    setFormData(prev => ({
      ...prev,
      billingRates: {
        ...prev.billingRates,
        [sessionType]: rateData,
      },
    }));

    // Clear any billing rate errors
    const errorKey = `billingRates.${sessionType}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  // Currency change handlers
  const handleCurrencyChange = (newCurrency) => {
    const updatedData = updateStudentCurrency(formData, newCurrency, true);
    setFormData(updatedData);

    // Clear currency-related errors
    setErrors(prev => ({
      ...prev,
      preferredCurrency: '',
      initialAmount: '',
    }));
  };

  const handleInitialAmountChange = (amount) => {
    // Keep the amount as string for the input, but store numeric value
    const numericAmount = amount === '' ? 0 : parseFloat(amount) || 0;
    setFormData(prev => ({
      ...prev,
      initialAmount: amount, // Store as string for input display
      initialAmountNumeric: numericAmount, // Store numeric value for calculations
    }));

    // Clear amount error
    setErrors(prev => ({
      ...prev,
      initialAmount: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent/Guardian name is required';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Parent phone is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setNotification({
        open: true,
        message: 'Please fix the errors before saving',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const studentData = {
        ...formData,
      };

      if (isEditing) {
        await firebaseService.updateStudent(id, studentData);
        setNotification({
          open: true,
          message: 'Student updated successfully!',
          severity: 'success',
        });
      } else {
        await firebaseService.addStudent(studentData);
        setNotification({
          open: true,
          message: 'Student added successfully!',
          severity: 'success',
        });
      }

      setTimeout(() => {
        navigate('/students');
      }, 1500);
    } catch (error) {
      console.error('Error saving student:', error);
      setNotification({
        open: true,
        message: 'Error saving student data',
        severity: 'error',
      });
    }
    setLoading(false);
  };

  const handleSubjectAdd = subject => {
    if (!formData.subjects.includes(subject)) {
      handleInputChange('subjects', [...formData.subjects, subject]);
    }
  };

  const handleSubjectRemove = subject => {
    handleInputChange(
      'subjects',
      formData.subjects.filter(s => s !== subject)
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        p: 3,
      }}
    >
      <Paper
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          backgroundColor: '#ffffff',
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
            }}
          >
            {isEditing ? 'Update student information' : 'Enter student details to get started'}
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.colors.text.primary }}>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={e => handleInputChange('dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.grade}>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={formData.grade}
                  onChange={e => handleInputChange('grade', e.target.value)}
                  label="Grade"
                >
                  {GRADE_LEVELS.map(grade => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="School"
                value={formData.school}
                onChange={e => handleInputChange('school', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                />
                <MobileContactPicker
                  fieldType="phone"
                  onContactSelected={(contact) => {
                    if (contact.phone) {
                      handleInputChange('phone', contact.phone);
                    }
                    if (contact.name && !formData.firstName && !formData.lastName) {
                      const nameParts = contact.name.split(' ');
                      handleInputChange('firstName', nameParts[0] || '');
                      handleInputChange('lastName', nameParts.slice(1).join(' ') || '');
                    }
                  }}
                  size="medium"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
              />
            </Grid>

            {/* Parent/Guardian Information */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.colors.text.primary, mt: 3 }}
              >
                Parent/Guardian Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parent/Guardian Name"
                value={formData.parentName}
                onChange={e => handleInputChange('parentName', e.target.value)}
                error={!!errors.parentName}
                helperText={errors.parentName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parent Email"
                type="email"
                value={formData.parentEmail}
                onChange={e => handleInputChange('parentEmail', e.target.value)}
                error={!!errors.parentEmail}
                helperText={errors.parentEmail}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Parent Phone"
                  value={formData.parentPhone}
                  onChange={e => handleInputChange('parentPhone', e.target.value)}
                  error={!!errors.parentPhone}
                  helperText={errors.parentPhone}
                  required
                />
                <MobileContactPicker
                  fieldType="both"
                  onContactSelected={(contact) => {
                    if (contact.phone) {
                      handleInputChange('parentPhone', contact.phone);
                    }
                    if (contact.email) {
                      handleInputChange('parentEmail', contact.email);
                    }
                    if (contact.name && !formData.parentName) {
                      handleInputChange('parentName', contact.name);
                    }
                  }}
                  size="medium"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={e => handleInputChange('emergencyContact', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Emergency Phone"
                  value={formData.emergencyPhone}
                  onChange={e => handleInputChange('emergencyPhone', e.target.value)}
                />
                <MobileContactPicker
                  fieldType="both"
                  onContactSelected={(contact) => {
                    if (contact.phone) {
                      handleInputChange('emergencyPhone', contact.phone);
                    }
                    if (contact.name && !formData.emergencyContact) {
                      handleInputChange('emergencyContact', contact.name);
                    }
                  }}
                  size="medium"
                />
              </Box>
            </Grid>

            {/* Academic Information */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.colors.text.primary, mt: 3 }}
              >
                Academic Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: theme.colors.text.primary }}
              >
                Subjects
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControl sx={{ minWidth: 200, mr: 2 }}>
                  <InputLabel>Add Subject</InputLabel>
                  <Select
                    value=""
                    onChange={e => handleSubjectAdd(e.target.value)}
                    label="Add Subject"
                  >
                    {SUBJECTS.filter(subject => !formData.subjects.includes(subject)).map(
                      subject => (
                        <MenuItem key={subject} value={subject}>
                          {subject}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.subjects.map(subject => (
                  <Chip
                    key={subject}
                    label={subject}
                    onDelete={() => handleSubjectRemove(subject)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Learning Goals"
                multiline
                rows={3}
                value={formData.learningGoals}
                onChange={e => handleInputChange('learningGoals', e.target.value)}
                placeholder="What are the student's learning objectives?"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Needs / Accommodations"
                multiline
                rows={2}
                value={formData.specialNeeds}
                onChange={e => handleInputChange('specialNeeds', e.target.value)}
                placeholder="Any special learning needs or accommodations"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={e => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information about the student"
              />
            </Grid>

            {/* Session Preferences */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.colors.text.primary, mt: 3 }}
              >
                Session Preferences
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Preferred Session Type</InputLabel>
                <Select
                  value={formData.preferredSessionType}
                  onChange={e => handleInputChange('preferredSessionType', e.target.value)}
                  label="Preferred Session Type"
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="in_person_class">In-Person Class</MenuItem>
                  <MenuItem value="in_person_one_on_one">In-Person One-on-One</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Session Duration</InputLabel>
                <Select
                  value={formData.sessionDuration}
                  onChange={e => handleInputChange('sessionDuration', e.target.value)}
                  label="Session Duration"
                >
                  <MenuItem value={1}>1 hour</MenuItem>
                  <MenuItem value={1.5}>1.5 hours</MenuItem>
                  <MenuItem value={2}>2 hours</MenuItem>
                  <MenuItem value={2.5}>2.5 hours</MenuItem>
                  <MenuItem value={3}>3 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Time"
                type="time"
                value={formData.preferredTime}
                onChange={e => handleInputChange('preferredTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Currency & Billing Section */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            💰 Currency & Billing
          </Typography>

          {/* Currency Selection */}
          <Box sx={{ mb: 4 }}>
            <StudentCurrencySelector
              selectedCurrency={formData.preferredCurrency}
              initialAmount={formData.initialAmount}
              onCurrencyChange={handleCurrencyChange}
              onAmountChange={handleInitialAmountChange}
              showAmount={true}
              showExchangeRate={true}
              error={errors.preferredCurrency}
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Billing Rates */}
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            Session Rates
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              mb: 3,
              fontSize: '14px',
            }}
          >
            Set custom hourly rates for different session types. Leave empty to use default rates.
          </Typography>

          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12} md={4}>
              <BillingRateInput
                sessionType="online"
                value={formData.billingRates.online}
                onChange={handleBillingRateChange}
                label="Online Sessions"
                icon={<OnlineIcon />}
                color="#2196F3"
                helperText="Virtual tutoring sessions"
                error={errors['billingRates.online']}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <BillingRateInput
                sessionType="in_person_class"
                value={formData.billingRates.in_person_class}
                onChange={handleBillingRateChange}
                label="In-Person Class"
                icon={<ClassIcon />}
                color="#4CAF50"
                helperText="Group classroom sessions"
                error={errors['billingRates.in_person_class']}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <BillingRateInput
                sessionType="in_person_one_on_one"
                value={formData.billingRates.in_person_one_on_one}
                onChange={handleBillingRateChange}
                label="One-on-One Sessions"
                icon={<OneOnOneIcon />}
                color="#FF9800"
                helperText="Individual tutoring sessions"
                error={errors['billingRates.in_person_one_on_one']}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

        {/* Action Buttons */}
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/students')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
          </Button>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditStudentPage;
