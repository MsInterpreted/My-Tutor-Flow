import { useState, lazy, Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Snackbar,
  Chip,
  Tooltip,
  IconButton,
  Button,

} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import useStudentProfileData from '../hooks/useStudentProfileData';
import AttendanceTable from '../components/AttendanceTable';
import MarksTable from '../components/MarksTable';
import InvoicesTable from '../components/InvoicesTableNew';
import ParentLogsList from '../components/ParentLogsList';
import DocumentsList from '../components/DocumentsList';
import StudentBillingRatesDisplay from '../components/StudentBillingRatesDisplay';
import { CurrencyDisplay, CompactCurrencyDisplay } from '../components/currency';
import { getStudentCurrencyDisplay, formatAmountForStudent } from '../utils/studentCurrencyUtils';
const AnalyticsCharts = lazy(() => import('../components/AnalyticsCharts'));
const AttendanceEditModal = lazy(() => import('../components/AttendanceEditModal'));
const MarksEditModal = lazy(() => import('../components/MarksEditModal'));
const ParentLogAddModal = lazy(() => import('../components/ParentLogAddModal'));
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AddIcon from '@mui/icons-material/Add';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EditIcon from '@mui/icons-material/Edit';
import BirthdayCakeIcon from '@mui/icons-material/Cake';
import PaidIcon from '@mui/icons-material/Paid';
import { SESSION_TYPE_LABELS } from '../utils/constants';
import dayjs from 'dayjs';

function getBirthdayReminder(student) {
  const dobField = student?.dateOfBirth || student?.dob;
  if (!dobField) return null;

  const today = dayjs();
  const dob = dayjs(dobField.toDate ? dobField.toDate() : dobField);
  const thisYear = dob.year(today.year());
  const nextBirthday = thisYear.isBefore(today) ? thisYear.add(1, 'year') : thisYear;
  const daysToBirthday = nextBirthday.diff(today, 'day');

  const studentName =
    student.firstName && student.lastName
      ? `${student.firstName} ${student.lastName}`
      : student.name || 'this student';

  if (daysToBirthday === 0) return "🎉 Today is this student's birthday!";
  if (daysToBirthday <= 14 && daysToBirthday > 0)
    return `🎂 ${studentName}'s birthday is in ${daysToBirthday} days (${nextBirthday.format('MMMM D')})!`;
  return null;
}
function getInvoiceReminder(invoices) {
  const unpaid = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue');
  if (unpaid.length === 0) return null;
  const overdue = unpaid.filter(inv => inv.status === 'overdue');
  if (overdue.length) return `⚠️ You have ${overdue.length} overdue invoice(s) for this student.`;
  return `⏰ You have ${unpaid.length} unpaid invoice(s) for this student.`;
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    student,
    attendanceSummary,
    attendance,
    marks,
    invoices,
    parentLogs,
    documents,
    allAttendance,
    allInvoices,
    loading,
    error,
    snackbar,
    setSnackbar,
    reloadData,
  } = useStudentProfileData(id);

  const [editAttendance, setEditAttendance] = useState(null);
  const [editMark, setEditMark] = useState(null);
  const [addParentLogOpen, setAddParentLogOpen] = useState(false);
  const [addMarkOpen, setAddMarkOpen] = useState(false);
  const [addAttendanceOpen, setAddAttendanceOpen] = useState(false);

  // PRODUCTION: Removed mock data info display

  // Scroll to top when component loads (especially important for mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]); // Trigger when student ID changes

  if (loading)
    return (
      <Box textAlign="center" mt={6}>
        <Typography>Loading...</Typography>
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" mt={6}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  if (!student) return null;

  const birthdayReminder = getBirthdayReminder(student);
  const invoiceReminder = getInvoiceReminder(invoices);

  return (
    <Box
      maxWidth={1200}
      mx="auto"
      mt={4}
      sx={{
        backgroundColor: theme.colors.background.primary,
        minHeight: '100vh',
        p: 2,
      }}
    >
      {/* Production-ready: Removed mock data indicator - no longer needed */}

      {/* Reminders */}
      {(birthdayReminder || invoiceReminder) && (
        <Box mb={2}>
          {birthdayReminder && (
            <Box mb={1}>
              <Chip
                label={birthdayReminder}
                icon={<BirthdayCakeIcon color="warning" />}
                sx={{ background: '#ffecb3', color: '#6d4c41', fontWeight: 'bold' }}
              />
            </Box>
          )}
          {invoiceReminder && (
            <Chip
              label={invoiceReminder}
              icon={<PaidIcon color="error" />}
              sx={{ background: '#ffcdd2', color: '#b71c1c', fontWeight: 'bold' }}
            />
          )}
        </Box>
      )}

      <Paper
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: theme.colors.background.secondary,
          borderRadius: '16px',
          border: `1px solid ${theme.colors.background.tertiary}`,
        }}
      >
        <Grid container spacing={2}>
          {/* Student Info */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography
                variant="h4"
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ color: theme.colors.text.primary, fontWeight: 700 }}
              >
                {student.firstName && student.lastName
                  ? `${student.firstName} ${student.lastName}`
                  : student.name || 'Unnamed Student'}
                <InfoOutlinedIcon sx={{ color: theme.colors.brand.primary, fontSize: 28 }} />
              </Typography>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/students/edit/${id}`)}
                sx={{
                  ml: 2,
                  backgroundColor: theme.colors.brand.primary,
                  color: '#000000',
                  fontWeight: 600,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: theme.colors.brand.primary,
                    opacity: 0.9,
                  },
                }}
              >
                Edit Student
              </Button>
            </Box>
            <Typography variant="subtitle1" sx={{ color: theme.colors.text.primary, mb: 1 }}>
              <strong>Grade:</strong> {student.grade || '-'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: theme.colors.text.primary, mb: 1 }}>
              <strong>School:</strong> {student.school || '-'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: theme.colors.text.primary, mb: 1 }}>
              <strong>Email:</strong> {student.email || '-'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: theme.colors.text.primary, mb: 1 }}>
              <strong>Phone:</strong> {student.phone || '-'}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Parent Name:</strong> {student.parentName || '-'}
            </Typography>
            <Typography variant="subtitle1" mb={2}>
              <strong>Parent Contact:</strong> {student.parentPhone || student.parentContact || '-'}
            </Typography>
            {(student.dateOfBirth || student.dob) && (
              <Typography variant="subtitle2" mb={2}>
                <strong>Date of Birth:</strong>{' '}
                {dayjs(
                  student.dateOfBirth || (student.dob?.toDate ? student.dob.toDate() : student.dob)
                ).format('YYYY-MM-DD')}
              </Typography>
            )}
            {student.subjects && student.subjects.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" mb={1}>
                  <strong>Subjects:</strong>
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {student.subjects.map((subject, index) => (
                    <Chip
                      key={index}
                      label={subject}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
            {student.learningGoals && (
              <Box mt={2}>
                <Typography variant="subtitle2" mb={1}>
                  <strong>Learning Goals:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.learningGoals}
                </Typography>
              </Box>
            )}
            {student.specialNeeds && (
              <Box mt={2}>
                <Typography variant="subtitle2" mb={1}>
                  <strong>Special Needs/Accommodations:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.specialNeeds}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Billing Rates Display */}
            <Box sx={{ mb: 3 }}>
              <StudentBillingRatesDisplay
                billingRates={student.billingRates}
                compact={true}
              />
            </Box>

            <Typography
              variant="subtitle1"
              mb={1}
              sx={{ color: theme.colors.text.primary, fontWeight: 700 }}
            >
              <strong>Attendance Summary</strong>
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {Object.keys(SESSION_TYPE_LABELS).map(key =>
                attendanceSummary[key] ? (
                  <Chip
                    key={key}
                    label={`${SESSION_TYPE_LABELS[key]}: ${attendanceSummary[key].count} sessions (${attendanceSummary[key].totalHours} hrs)`}
                    color={
                      key === 'online'
                        ? 'primary'
                        : key === 'in_person_class'
                          ? 'success'
                          : 'warning'
                    }
                    variant="outlined"
                    icon={<EventAvailableOutlinedIcon />}
                    sx={{ mb: 1 }}
                  />
                ) : null
              )}
              {!Object.keys(attendanceSummary).length && (
                <Chip label="No attendance yet" variant="outlined" />
              )}
            </Box>
            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
              <Tooltip title="Quick Add Attendance">
                <IconButton
                  onClick={() => {
                    console.log('🔄 Quick Add Attendance clicked!');
                    setAddAttendanceOpen(true);
                  }}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Quick Marks">
                <IconButton
                  onClick={() => {
                    console.log('🔄 Add Quick Marks clicked!');
                    setAddMarkOpen(true);
                  }}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                  }}
                >
                  <SchoolOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Quick Add Communication Log">
                <IconButton
                  onClick={() => setAddParentLogOpen(true)}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Suspense
        fallback={
          <Box textAlign="center" my={3}>
            <Typography>Loading analytics...</Typography>
          </Box>
        }
      >
        <AnalyticsCharts attendance={allAttendance || []} marks={marks || []} />
      </Suspense>

      <AttendanceTable
        data={attendance || []}
        onEdit={a => setEditAttendance(a)}
        allData={allAttendance || []}
        student={student}
        reload={reloadData}
      />

      <MarksTable
        data={marks || []}
        onEdit={m => setEditMark(m)}
        student={student}
        reload={reloadData}
      />

      <InvoicesTable
        data={invoices || []}
        allData={allInvoices || []}
        student={student}
        reload={reloadData}
      />

      <ParentLogsList
        logs={parentLogs || []}
        onAdd={() => setAddParentLogOpen(true)}
        student={student}
        reload={reloadData}
      />

      <DocumentsList documents={documents} studentId={student?.id || ''} reload={reloadData} />

      {/* Modals - Only render when student data is available */}
      {student?.id && (
        <>
          <Suspense fallback={null}>
            <AttendanceEditModal
              open={!!editAttendance}
              attendance={editAttendance}
              onClose={() => setEditAttendance(null)}
              studentId={student.id}
              reload={reloadData}
              setSnackbar={setSnackbar}
            />
          </Suspense>
          <Suspense fallback={null}>
            <AttendanceEditModal
              open={addAttendanceOpen}
              attendance={null}
              onClose={() => setAddAttendanceOpen(false)}
              studentId={student.id}
              reload={reloadData}
              setSnackbar={setSnackbar}
            />
          </Suspense>
          <Suspense fallback={null}>
            <MarksEditModal
              open={!!editMark}
              mark={editMark}
              studentId={student.id}
              student={student}
              onClose={() => setEditMark(null)}
              reload={reloadData}
              setSnackbar={setSnackbar}
            />
          </Suspense>
          <Suspense fallback={null}>
            <MarksEditModal
              open={addMarkOpen}
              mark={null}
              studentId={student.id}
              student={student}
              onClose={() => setAddMarkOpen(false)}
              reload={reloadData}
              setSnackbar={setSnackbar}
            />
          </Suspense>
          <Suspense fallback={null}>
            <ParentLogAddModal
              open={addParentLogOpen}
              studentId={student.id}
              onClose={() => setAddParentLogOpen(false)}
              reload={reloadData}
              setSnackbar={setSnackbar}
            />
          </Suspense>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}
