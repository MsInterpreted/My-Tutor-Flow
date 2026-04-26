import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { STATUS_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import { useTheme } from '../theme/ThemeContext';
import dayjs from 'dayjs';

// Firebase service import
import firebaseService from '../services/firebaseService';

export default function InvoicesTable({ data, allData, student, reload }) {
  const theme = useTheme();
  const [invoices, setInvoices] = useState([]);

  // Fetch invoices using firebaseService if data not provided
  useEffect(() => {
    if (data === undefined || data === null) {
      const fetchInvoices = async () => {
        try {
          console.log('🔄 Fetching invoices via firebaseService...');
          let fetchedInvoices;

          if (student) {
            fetchedInvoices = await firebaseService.getInvoicesForStudent(student.id);
          } else {
            fetchedInvoices = await firebaseService.getAllInvoices();
          }

          setInvoices(fetchedInvoices);
          console.log('✅ Invoices fetched successfully:', fetchedInvoices.length);
        } catch (error) {
          console.warn('❌ Error fetching invoices:', error);
          setInvoices([]); // Set empty array on error
        }
      };

      fetchInvoices();
    }
  }, [student, data]);

  // Use data from props if provided, else fallback to internal state
  const displayInvoices = data !== undefined && data !== null ? data : invoices;

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        borderRadius: '16px',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
          }}
        >
          Recent Invoices
        </Typography>
        {reload && (
          <Tooltip title="Refresh Invoices">
            <IconButton
              onClick={reload}
              size="small"
              sx={{
                color: theme.colors.text.primary,
                '&:hover': {
                  backgroundColor: theme.colors.background.tertiary,
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: theme.colors.text.secondary }}>
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              displayInvoices.map(inv => {
                try {
                  return (
                    <TableRow key={inv.id || `invoice-${Math.random()}`}>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {inv.invoiceDate
                          ? dayjs(inv.invoiceDate).format('YYYY-MM-DD')
                          : inv.createdAt
                            ? dayjs(inv.createdAt).format('YYYY-MM-DD')
                            : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {inv.amount != null ? formatCurrency(Number(inv.amount)) : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inv.status || 'pending'}
                          color={STATUS_COLORS[inv.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                } catch (error) {
                  console.error('Error rendering invoice row:', error, inv);
                  return (
                    <TableRow key={`error-${Math.random()}`}>
                      <TableCell colSpan={3} sx={{ color: theme.colors.text.secondary }}>
                        Error displaying invoice
                      </TableCell>
                    </TableRow>
                  );
                }
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
