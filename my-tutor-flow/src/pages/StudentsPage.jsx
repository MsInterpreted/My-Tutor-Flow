import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import firebaseService from '../services/firebaseService';
import { useTheme } from '../theme/ThemeContext';
import {
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
  Snackbar,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  EventAvailable as EventAvailableIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import SelectiveExportDialog from '../components/SelectiveExportDialog';
import StudentBillingSummary from '../components/StudentBillingSummary';
import QuickAddAttendanceModal from '../components/QuickAddAttendanceModal';
import QuickAddMarkModal from '../components/QuickAddMarkModal';
// import StudentDebugInfo from '../components/StudentDebugInfo';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const [quickAddAttendanceOpen, setQuickAddAttendanceOpen] = useState(false);
  const [quickAddMarkOpen, setQuickAddMarkOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Production-ready billing status component using real data
  const BillingStatusChip = ({ student }) => {
    const [billingStatus, setBillingStatus] = useState('loading');

    useEffect(() => {
      const calculateBillingStatus = async () => {
        try {
          // Get invoices for this student
          const invoices = await firebaseService.getInvoicesForStudent(student.id);

          if (invoices.length === 0) {
            setBillingStatus('no-invoices');
            return;
          }

          // Check for overdue invoices
          const now = new Date();
          const overdueInvoices = invoices.filter(invoice => {
            const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
            return dueDate && dueDate < now && invoice.status !== 'paid';
          });

          // Check for pending invoices
          const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');

          if (overdueInvoices.length > 0) {
            setBillingStatus('overdue');
          } else if (pendingInvoices.length > 0) {
            setBillingStatus('pending');
          } else {
            setBillingStatus('up-to-date');
          }
        } catch (error) {
          console.error('Error calculating billing status:', error);
          setBillingStatus('no-invoices');
        }
      };

      calculateBillingStatus();
    }, [student.id]);

    const getStatusProps = status => {
      switch (status) {
        case 'up-to-date':
          return { label: 'Up to Date', color: 'success' };
        case 'pending':
          return { label: 'Pending', color: 'warning' };
        case 'overdue':
          return { label: 'Overdue', color: 'error' };
        case 'loading':
          return { label: 'Loading...', color: 'default' };
        default:
          return { label: 'No Invoices', color: 'default' };
      }
    };

    const statusProps = getStatusProps(billingStatus);

    return (
      <Chip
        label={statusProps.label}
        color={statusProps.color}
        size="small"
        sx={{ fontSize: '0.75rem' }}
      />
    );
  };

  // Mobile-optimized student card component
  const StudentCard = ({ student }) => (
    <Card
      sx={{
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '12px',
        mb: 2,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Student Name and Email */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon sx={{ mr: 1, color: theme.colors.brand.primary, fontSize: '1.2rem' }} />
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              {`${student.firstName || ''} ${student.lastName || ''}`.trim() ||
                student.name ||
                'Unnamed Student'}
            </Typography>
          </Box>
          {student.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
              <EmailIcon sx={{ mr: 1, color: theme.colors.text.secondary, fontSize: '1rem' }} />
              <Typography variant="body2" color={theme.colors.text.secondary}>
                {student.email}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1.5, borderColor: theme.colors.background.tertiary }} />

        {/* Student Details */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
              GRADE
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 500 }}>
              {student.grade || '-'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
              SCHOOL
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 500 }}>
              {student.school || '-'}
            </Typography>
          </Box>

          {(student.parentEmail || student.parentPhone) && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                PARENT CONTACT
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {student.parentEmail && (
                  <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontSize: '0.875rem' }}>
                    📧 {student.parentEmail}
                  </Typography>
                )}
                {student.parentPhone && (
                  <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontSize: '0.875rem' }}>
                    📞 {student.parentPhone}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {student.subjects && student.subjects.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                SUBJECTS
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.primary, mt: 0.5 }}>
                {student.subjects.join(', ')}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
              BILLING STATUS
            </Typography>
            <BillingStatusChip student={student} />
          </Box>
        </Box>

        <Divider sx={{ my: 1.5, borderColor: theme.colors.background.tertiary }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            component={RouterLink}
            to={`/students/${student.id}`}
            variant="contained"
            size="small"
            startIcon={<VisibilityIcon />}
            sx={{
              backgroundColor: theme.colors.brand.primary,
              color: 'white',
              flex: 1,
              minHeight: '48px',
              '&:hover': {
                backgroundColor: theme.colors.brand.secondary,
              },
            }}
          >
            View Profile
          </Button>
          <Button
            onClick={() => navigate(`/students/${student.id}/edit`)}
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            sx={{
              borderColor: theme.colors.brand.primary,
              color: theme.colors.brand.primary,
              flex: 1,
              minHeight: '48px',
              '&:hover': {
                backgroundColor: theme.colors.background.tertiary,
              },
            }}
          >
            Edit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Reload function for modals
  const reloadStudents = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      console.log('🔄 Reloading students...');

      // PRODUCTION: Directly fetch students - firebaseService handles fallback internally
      const studentList = await firebaseService.getStudents();
      console.log('✅ Students reloaded successfully:', studentList.length, 'students');
      setStudents(studentList);

      // PRODUCTION: Mock data handling is now internal to firebaseService

      if (studentList.length === 0) {
        setFetchError('No students found. Please add students first.');
      } else {
        setFetchError(''); // Clear any previous errors
      }
    } catch (err) {
      console.error('❌ Error reloading students:', err);
      setFetchError('Failed to reload students. Please try again.');
      // PRODUCTION: Error handling - firebaseService manages mock data fallback internally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        console.log('🔄 Starting to fetch students...');

        // PRODUCTION: Directly fetch students - firebaseService handles fallback internally
        const studentList = await firebaseService.getStudents();
        console.log('✅ Students fetched successfully:', studentList.length, 'students');
        setStudents(studentList);

        // PRODUCTION: Mock data handling is now internal to firebaseService

        if (studentList.length === 0) {
          setFetchError('No students found. Please add students first.');
        } else {
          setFetchError(''); // Clear any previous errors
        }
      } catch (err) {
        console.error('❌ Error fetching students:', err);
        setFetchError('Failed to load students. Please refresh the page.');
        // PRODUCTION: Error handling - firebaseService manages mock data fallback internally
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleExportStudents = selectedStudents => {
    // Convert students to CSV
    const headers = ['Name', 'Grade', 'School', 'Email', 'Phone', 'Parent Name', 'Parent Email'];
    const csvContent = [
      headers.join(','),
      ...selectedStudents.map(student =>
        [
          student.name || '',
          student.grade || '',
          student.school || '',
          student.email || '',
          student.phone || '',
          student.parentName || '',
          student.parentEmail || '',
        ]
          .map(field => `"${field}"`)
          .join(',')
      ),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        p: 3,
      }}
    >
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Students</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              console.log('🔄 Export button clicked!');
              setExportDialogOpen(true);
            }}
            disabled={students.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🔄 Add Student button clicked!');
              console.log('🔄 Navigating to /students/add...');
              try {
                navigate('/students/add');
                console.log('🔄 Navigation successful!');
              } catch (error) {
                console.error('🔄 Navigation error:', error);
              }
            }}
            sx={{
              pointerEvents: 'auto',
              zIndex: 1000,
            }}
          >
            Add New Student
          </Button>
        </Box>
      </Box>

      {/* Debug Info - Temporarily removed to fix button clicks */}
      {/* <StudentDebugInfo /> */}

      {/* Quick Add Buttons - Responsive Design */}
      {!loading && !fetchError && students.length > 0 && (
        <Box
          sx={{
            mb: 3,
            p: isMobile ? 2 : 3,
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '16px',
            boxShadow: theme.shadows.card,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 2,
              textAlign: isMobile ? 'center' : 'left',
              fontSize: isMobile ? '1.1rem' : '1.25rem',
            }}
          >
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: isMobile ? 2 : 3,
              justifyContent: isMobile ? 'center' : 'flex-start',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<EventAvailableIcon />}
              onClick={() => setQuickAddAttendanceOpen(true)}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000000',
                fontWeight: 600,
                borderRadius: '12px',
                minHeight: isMobile ? '48px' : '44px',
                px: isMobile ? 3 : 4,
                py: isMobile ? 1.5 : 1,
                fontSize: isMobile ? '0.875rem' : '0.95rem',
                boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.colors.brand.secondary,
                  boxShadow: '0 4px 12px rgba(0, 212, 170, 0.4)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Add Attendance
            </Button>
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => setQuickAddMarkOpen(true)}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000000',
                fontWeight: 600,
                borderRadius: '12px',
                minHeight: isMobile ? '48px' : '44px',
                px: isMobile ? 3 : 4,
                py: isMobile ? 1.5 : 1,
                fontSize: isMobile ? '0.875rem' : '0.95rem',
                boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.colors.brand.secondary,
                  boxShadow: '0 4px 12px rgba(0, 212, 170, 0.4)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Add Mark
            </Button>

            {/* Desktop-only additional info */}
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  fontStyle: 'italic',
                  ml: 2,
                }}
              >
                Quickly add attendance or marks for any student
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Student Billing Summary */}
      {!loading && !fetchError && students.length > 0 && (
        <StudentBillingSummary
          students={students}
          onViewDetails={student => navigate(`/students/${student.id}`)}
        />
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : fetchError ? (
        <Alert severity="error">{fetchError}</Alert>
      ) : students.length === 0 ? (
        <Alert severity="info">No students found. Add your first student!</Alert>
      ) : isMobile ? (
        // Mobile card layout
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          {students.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </Box>
      ) : (
        // Desktop table layout
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '16px',
            boxShadow: theme.shadows.card,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Student Name
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Grade
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  School
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Parent Contact
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Subjects
                </TableCell>
                <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Billing Status
                </TableCell>
                <TableCell align="right" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map(student => (
                <TableRow
                  key={student.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.isDarkMode
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {`${student.firstName || ''} ${student.lastName || ''}`.trim() ||
                          student.name ||
                          'Unnamed Student'}
                      </Typography>
                      {student.email && (
                        <Typography variant="body2" color={theme.colors.text.secondary}>
                          {student.email}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    {student.grade || '-'}
                  </TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    {student.school || '-'}
                  </TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    <Box>
                      {student.parentName && (
                        <Typography variant="body2">{student.parentName}</Typography>
                      )}
                      {student.parentPhone && (
                        <Typography variant="body2" color={theme.colors.text.secondary}>
                          {student.parentPhone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {student.subjects && student.subjects.length > 0 ? (
                        student.subjects.slice(0, 2).map((subject, index) => (
                          <Typography
                            key={index}
                            variant="caption"
                            sx={{
                              backgroundColor: theme.colors.primary + '20',
                              color: theme.colors.primary,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            {subject}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2" color={theme.colors.text.secondary}>
                          No subjects
                        </Typography>
                      )}
                      {student.subjects && student.subjects.length > 2 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.colors.text.secondary,
                            px: 1,
                            py: 0.5,
                          }}
                        >
                          +{student.subjects.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <BillingStatusChip student={student} />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        component={RouterLink}
                        to={`/students/${student.id}`}
                        sx={{
                          borderColor: theme.colors.primary,
                          color: theme.colors.primary,
                          '&:hover': {
                            backgroundColor: theme.colors.primary + '10',
                          },
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        component={RouterLink}
                        to={`/students/edit/${student.id}`}
                        sx={{
                          color: theme.colors.text.secondary,
                          '&:hover': {
                            backgroundColor: theme.isDarkMode
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.05)',
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Export Dialog */}
      <SelectiveExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        students={students}
        onExport={handleExportStudents}
        title="Select Students to Export"
      />

      {/* Quick Add Modals */}
      <QuickAddAttendanceModal
        open={quickAddAttendanceOpen}
        onClose={() => setQuickAddAttendanceOpen(false)}
        students={students}
        reload={reloadStudents}
        setSnackbar={setSnackbar}
      />

      <QuickAddMarkModal
        open={quickAddMarkOpen}
        onClose={() => setQuickAddMarkOpen(false)}
        students={students}
        reload={reloadStudents}
        setSnackbar={setSnackbar}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentsPage;
