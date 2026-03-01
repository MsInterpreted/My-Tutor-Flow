import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Autocomplete,
  TextField,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const StudentProgressReports = ({
  students,
  selectedStudent,
  setSelectedStudent,
  reportDialogOpen,
  setReportDialogOpen,
  theme,
}) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [reportData, setReportData] = useState({
    termSystem: '4-term', // '4-term' or '3-term'
    currentTerm: 1,
    subjects: [],
    marks: {},
    comments: '',
  });

  const [newSubject, setNewSubject] = useState('');
  const [editingMark, setEditingMark] = useState(null);

  const termOptions = {
    '4-term': ['1st Term', '2nd Term', '3rd Term', '4th Term'],
    '3-term': ['1st Term', '2nd Term', '3rd Term'],
  };

  const markTypes = [
    'Report Mark',
    'Cycle Test',
    'Spot Test',
    'Project Mark',
    'Assignment',
    'Participation',
  ];

  const handleAddSubject = () => {
    if (newSubject && !reportData.subjects.includes(newSubject)) {
      setReportData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject],
        marks: {
          ...prev.marks,
          [newSubject]: {},
        },
      }));
      setNewSubject('');
    }
  };

  const handleAddMark = (subject, markType, value) => {
    setReportData(prev => ({
      ...prev,
      marks: {
        ...prev.marks,
        [subject]: {
          ...prev.marks[subject],
          [markType]: value,
        },
      },
    }));
  };

  const calculateAverage = subjectMarks => {
    const marks = Object.values(subjectMarks).filter(mark => mark !== '');
    if (marks.length === 0) return 0;
    return (marks.reduce((sum, mark) => sum + parseFloat(mark || 0), 0) / marks.length).toFixed(1);
  };

  const generatePDFReport = async () => {
    if (!selectedStudent) {
      alert('Please select a student first');
      return;
    }

    try {
      const reportContent = {
        student: selectedStudent,
        term: termOptions[reportData.termSystem][reportData.currentTerm - 1],
        subjects: reportData.subjects.map(subject => ({
          name: subject,
          marks: reportData.marks[subject],
          average: calculateAverage(reportData.marks[subject] || {}),
        })),
        comments: reportData.comments,
        generatedDate: new Date().toLocaleDateString(),
      };

      // Create PDF using jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MY TUTOR FLOW', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      pdf.setFontSize(16);
      pdf.text('PROGRESS REPORT', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Student Info
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Student: ${selectedStudent.name}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Term: ${reportContent.term}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Generated: ${reportContent.generatedDate}`, 20, yPosition);
      yPosition += 15;

      // Academic Performance Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ACADEMIC PERFORMANCE', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      reportContent.subjects.forEach(subject => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.text(`${subject.name}: Average ${subject.average}%`, 20, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'normal');
        Object.entries(subject.marks).forEach(([type, mark]) => {
          if (mark) {
            pdf.text(`  ${type}: ${mark}%`, 25, yPosition);
            yPosition += 5;
          }
        });
        yPosition += 5;
      });

      // Comments Section
      if (reportData.comments) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('COMMENTS', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const splitComments = pdf.splitTextToSize(reportData.comments, pageWidth - 40);
        pdf.text(splitComments, 20, yPosition);
      }

      // Save the PDF
      const fileName = `${selectedStudent.name}_Progress_Report_${reportContent.term}.pdf`;
      pdf.save(fileName);

      alert('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Student Selection */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            borderRadius: '16px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: theme.shadows.card,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 2,
            }}
          >
            Select Student
          </Typography>
          <Autocomplete
            options={students}
            getOptionLabel={option => option.name || ''}
            value={selectedStudent}
            onChange={(_, newValue) => setSelectedStudent(newValue)}
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Search for a student..."
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    color: theme.colors.brand.primary,
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: theme.colors.brand.primary,
                    },
                  },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.colors.background.tertiary,
                    minWidth: '100%',
                    minHeight: isMobile ? '48px' : 'auto',
                    '& fieldset': {
                      borderColor: theme.colors.brand.primary + '40',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.colors.brand.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.colors.brand.primary,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    minWidth: '200px !important',
                    width: '100% !important',
                    color: theme.colors.text.primary,
                    fontSize: isMobile ? '16px' : '14px',
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
                    minWidth: isMobile ? '100%' : '300px',
                    width: '100%',
                    minHeight: '48px',
                    padding: isMobile ? '12px 16px' : '8px 16px',
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    color: theme.colors.brand.primary,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: `${theme.colors.brand.primary}20`,
                    },
                    '&.Mui-focused': {
                      backgroundColor: `${theme.colors.brand.primary}30`,
                    },
                    // Touch-friendly for mobile
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <PersonIcon
                    sx={{
                      mr: 2,
                      color: theme.colors.brand.primary,
                      flexShrink: 0,
                      fontSize: isMobile ? '20px' : '18px',
                    }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'visible',
                        textOverflow: 'unset',
                        minWidth: 'max-content',
                        color: theme.colors.brand.primary,
                        fontWeight: 600,
                        fontSize: isMobile ? '16px' : '14px',
                      }}
                    >
                      {option.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'visible',
                        textOverflow: 'unset',
                        color: theme.colors.text.secondary,
                        fontSize: isMobile ? '14px' : '12px',
                      }}
                    >
                      Grade {option.grade} • {option.school}
                    </Typography>
                  </Box>
                </Box>
              );
            }}
            ListboxProps={{
              sx: {
                minWidth: isMobile ? '100%' : '300px',
                maxWidth: 'none',
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.brand.primary}40`,
                borderRadius: '12px',
                '& .MuiAutocomplete-option': {
                  minWidth: isMobile ? '100%' : '300px',
                  minHeight: '48px',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                },
              },
            }}
            PaperComponent={({ children, ...props }) => (
              <Paper
                {...props}
                sx={{
                  minWidth: isMobile ? '100%' : '300px',
                  maxWidth: 'none',
                  width: isMobile ? '100%' : 'max-content',
                  backgroundColor: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.brand.primary}40`,
                  borderRadius: '12px',
                  boxShadow: theme.shadows.lg,
                }}
              >
                {children}
              </Paper>
            )}
          />
        </Paper>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            borderRadius: '16px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
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
            }}
          >
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 1.5 : 2,
              flexWrap: 'wrap',
              alignItems: isMobile ? 'stretch' : 'flex-start',
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setReportDialogOpen(true)}
              disabled={!selectedStudent}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000000',
                minHeight: '48px',
                minWidth: isMobile ? '100%' : '140px',
                padding: isMobile ? '12px 24px' : '10px 20px',
                fontSize: isMobile ? '16px' : '14px',
                fontWeight: 600,
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: theme.colors.brand.primary,
                  opacity: 0.8,
                },
                '&:disabled': {
                  backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  color: theme.isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                },
                // Touch-friendly for mobile
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Create Report
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={generatePDFReport}
              disabled={!selectedStudent}
              sx={{
                borderColor: theme.colors.brand.primary,
                color: theme.colors.brand.primary,
                minHeight: '48px',
                minWidth: isMobile ? '100%' : '140px',
                padding: isMobile ? '12px 24px' : '10px 20px',
                fontSize: isMobile ? '16px' : '14px',
                fontWeight: 600,
                borderRadius: '12px',
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  backgroundColor: `${theme.colors.brand.primary}10`,
                  borderColor: theme.colors.brand.primary,
                  borderWidth: '2px',
                },
                '&:disabled': {
                  color: theme.isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
                // Touch-friendly for mobile
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              disabled={!selectedStudent}
              sx={{
                borderColor: theme.colors.brand.primary,
                color: theme.colors.brand.primary,
                minHeight: '48px',
                minWidth: isMobile ? '100%' : '120px',
                padding: isMobile ? '12px 24px' : '10px 20px',
                fontSize: isMobile ? '16px' : '14px',
                fontWeight: 600,
                borderRadius: '12px',
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  backgroundColor: `${theme.colors.brand.primary}10`,
                  borderColor: theme.colors.brand.primary,
                  borderWidth: '2px',
                },
                '&:disabled': {
                  color: theme.isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
                // Touch-friendly for mobile
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Edit Report
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Student Overview */}
      {selectedStudent && (
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Student Profile: {selectedStudent.name}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Card sx={{ backgroundColor: theme.colors.background.tertiary }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Grade
                    </Typography>
                    <Typography variant="h6">{selectedStudent.grade}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ backgroundColor: theme.colors.background.tertiary }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      School
                    </Typography>
                    <Typography variant="h6">{selectedStudent.school}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ backgroundColor: theme.colors.background.tertiary }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Current Average
                    </Typography>
                    <Typography variant="h6" color="primary">
                      85.2%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ backgroundColor: theme.colors.background.tertiary }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Reports Generated
                    </Typography>
                    <Typography variant="h6">4</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}

      {/* Progress Report Dialog */}
      <ProgressReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        selectedStudent={selectedStudent}
        reportData={reportData}
        setReportData={setReportData}
        termOptions={termOptions}
        markTypes={markTypes}
        newSubject={newSubject}
        setNewSubject={setNewSubject}
        handleAddSubject={handleAddSubject}
        handleAddMark={handleAddMark}
        calculateAverage={calculateAverage}
        generatePDFReport={generatePDFReport}
        theme={theme}
      />
    </Grid>
  );
};

// Progress Report Dialog Component
const ProgressReportDialog = ({
  open,
  onClose,
  selectedStudent,
  reportData,
  setReportData,
  termOptions,
  markTypes,
  newSubject,
  setNewSubject,
  handleAddSubject,
  handleAddMark,
  calculateAverage,
  generatePDFReport,
  theme,
}) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: theme.colors.background.secondary,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 600,
        }}
      >
        Create Progress Report - {selectedStudent?.name}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Term System Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: theme.colors.brand.primary,
                  },
                }}
              >
                Term System
              </InputLabel>
              <Select
                value={reportData.termSystem}
                onChange={e => setReportData(prev => ({ ...prev, termSystem: e.target.value }))}
                sx={{
                  minHeight: isMobile ? '48px' : 'auto',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.colors.brand.primary,
                    borderWidth: '2px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.colors.brand.primary,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.colors.brand.primary,
                    borderWidth: '2px',
                  },
                  '& .MuiSelect-select': {
                    color: theme.colors.text.primary,
                    fontSize: isMobile ? '16px' : '14px',
                    padding: isMobile ? '14px' : '12px',
                  },
                  // Touch-friendly for mobile
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.brand.primary}40`,
                      borderRadius: '12px',
                      boxShadow: theme.shadows.lg,
                      '& .MuiMenuItem-root': {
                        minHeight: '48px',
                        fontSize: isMobile ? '16px' : '14px',
                      },
                    },
                  },
                }}
              >
                <MenuItem
                  value="4-term"
                  sx={{
                    color: theme.colors.brand.primary,
                    fontWeight: 500,
                    minHeight: '48px',
                    fontSize: isMobile ? '16px' : '14px',
                    padding: isMobile ? '12px 16px' : '8px 16px',
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
                    // Touch-friendly for mobile
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  4 Term System
                </MenuItem>
                <MenuItem
                  value="3-term"
                  sx={{
                    color: theme.colors.brand.primary,
                    fontWeight: 500,
                    minHeight: '48px',
                    fontSize: isMobile ? '16px' : '14px',
                    padding: isMobile ? '12px 16px' : '8px 16px',
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
                    // Touch-friendly for mobile
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  3 Term System
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                  '&.Mui-focused': {
                    color: theme.colors.brand.primary,
                  },
                }}
              >
                Current Term
              </InputLabel>
              <Select
                value={reportData.currentTerm}
                onChange={e => setReportData(prev => ({ ...prev, currentTerm: e.target.value }))}
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
                {termOptions[reportData.termSystem].map((term, index) => (
                  <MenuItem
                    key={index}
                    value={index + 1}
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
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Add Subject */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Add Subject"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                sx={{
                  flexGrow: 1,
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
              <Button
                variant="contained"
                onClick={handleAddSubject}
                sx={{ backgroundColor: theme.colors.brand.primary }}
              >
                Add
              </Button>
            </Box>
          </Grid>

          {/* Subjects and Marks */}
          {reportData.subjects.map(subject => (
            <Grid item xs={12} key={subject}>
              <Paper sx={{ p: 2, backgroundColor: theme.colors.background.tertiary }}>
                <Typography variant="h6" sx={{ mb: 2, color: theme.colors.text.primary }}>
                  {subject} - Average: {calculateAverage(reportData.marks[subject] || {})}%
                </Typography>
                <Grid container spacing={2}>
                  {markTypes.map(markType => (
                    <Grid item xs={6} md={4} key={markType}>
                      <TextField
                        label={markType}
                        type="number"
                        value={reportData.marks[subject]?.[markType] || ''}
                        onChange={e => handleAddMark(subject, markType, e.target.value)}
                        inputProps={{ min: 0, max: 100 }}
                        size="small"
                        fullWidth
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
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}

          {/* Comments */}
          <Grid item xs={12}>
            <TextField
              label="Comments"
              multiline
              rows={4}
              value={reportData.comments}
              onChange={e => setReportData(prev => ({ ...prev, comments: e.target.value }))}
              fullWidth
              placeholder="Add teacher comments about student progress..."
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
                    color: theme.colors.text.primary,
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={generatePDFReport}
          startIcon={<DownloadIcon />}
          sx={{ backgroundColor: theme.colors.brand.primary }}
        >
          Generate PDF Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentProgressReports;
