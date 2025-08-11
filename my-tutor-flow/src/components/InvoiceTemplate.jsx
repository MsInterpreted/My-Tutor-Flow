import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { MyTutorFlowLogo } from './branding/MyTutorFlowLogo';
import { formatCurrency } from '../utils/helpers';
import dayjs from 'dayjs';

const InvoiceTemplate = ({
  invoice,
  student,
  companyInfo = {
    name: 'TD Learning Academy',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    appName: 'My Tutor Flow',
  },
  ...props
}) => {
  const theme = useTheme();

  const invoiceData = {
    number: invoice?.id || '',
    date: invoice?.createdAt
      ? dayjs(invoice.createdAt).format('MMMM DD, YYYY')
      : dayjs().format('MMMM DD, YYYY'),
    dueDate: invoice?.dueDate
      ? dayjs(invoice.dueDate).format('MMMM DD, YYYY')
      : dayjs().add(30, 'days').format('MMMM DD, YYYY'),
    amount: invoice?.amount || 0,
    currency: invoice?.currency || 'ZAR',
    status: invoice?.status || 'pending',
    description: invoice?.description || '',
    ...invoice,
  };

  const studentInfo = {
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    address: student?.address || '',
    ...student,
  };

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        borderRadius: '16px',
      }}
      {...props}
    >
      {/* Header with Logo and Company Info */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <MyTutorFlowLogo size={120} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                {companyInfo.address}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                {companyInfo.city}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                Phone: {companyInfo.phone}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                Email: {companyInfo.email}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Website: {companyInfo.website}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography
              variant="h3"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 700,
                mb: 2,
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              INVOICE
            </Typography>
            <Box>
              <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 1 }}>
                <strong>Invoice #:</strong> {invoiceData.number}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 1 }}>
                <strong>Date:</strong> {invoiceData.date}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 1 }}>
                <strong>Due Date:</strong> {invoiceData.dueDate}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider
        sx={{ mb: 4, borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      />

      {/* Bill To Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            mb: 2,
          }}
        >
          Bill To:
        </Typography>
        <Box
          sx={{
            p: 3,
            backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: '12px',
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: theme.colors.text.primary, fontWeight: 600, mb: 1 }}
          >
            {studentInfo.name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
            {studentInfo.email}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
            {studentInfo.phone}
          </Typography>
          {studentInfo.address && (
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
              {studentInfo.address}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Invoice Details Table */}
      <TableContainer sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Description
              </TableCell>
              <TableCell align="right" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: theme.colors.text.primary }}>
                {invoiceData.description}
              </TableCell>
              <TableCell align="right" sx={{ color: theme.colors.text.primary }}>
                {formatCurrency(invoiceData.amount, invoiceData.currency)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Divider
        sx={{ mb: 3, borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
      />

      {/* Total Section */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Box sx={{ minWidth: '200px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
              Total:
            </Typography>
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
              {formatCurrency(invoiceData.amount, invoiceData.currency)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Payment Instructions */}
      <Box
        sx={{
          p: 3,
          backgroundColor: theme.colors.brand.primary + '15',
          borderRadius: '12px',
          border: `1px solid ${theme.colors.brand.primary}30`,
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
          Payment Instructions
        </Typography>
        <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
          Please make payment by the due date listed above.
        </Typography>
        <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
          Payment methods: Cash, Check, Bank Transfer, or Online Payment
        </Typography>
        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
          For questions about this invoice, please contact us at {companyInfo.email}
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
          Thank you for choosing TD Learning Academy for your educational needs!
        </Typography>
      </Box>
    </Paper>
  );
};

export default InvoiceTemplate;
