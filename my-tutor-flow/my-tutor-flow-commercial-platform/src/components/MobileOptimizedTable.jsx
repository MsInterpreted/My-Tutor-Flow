import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

// Mobile-optimized table that switches to card layout on small screens
export default function MobileOptimizedTable({
  columns,
  data,
  renderActions,
  emptyMessage = 'No data available',
  ...props
}) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Mobile card layout
  if (isMobile) {
    return (
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        {data.length === 0 ? (
          <Card
            sx={{
              backgroundColor: theme.colors.background.secondary,
              textAlign: 'center',
              p: 3,
            }}
          >
            <Typography color={theme.colors.text.secondary}>
              {emptyMessage}
            </Typography>
          </Card>
        ) : (
          data.map((row, index) => (
            <Card
              key={row.id || index}
              sx={{
                backgroundColor: theme.colors.background.secondary,
                mb: 2,
                border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: '12px',
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {columns.map((column, colIndex) => (
                  <Box key={column.key || colIndex} sx={{ mb: colIndex < columns.length - 1 ? 1.5 : 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {column.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.text.primary,
                        fontWeight: 500,
                        mt: 0.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </Typography>
                    {colIndex < columns.length - 1 && (
                      <Divider sx={{ mt: 1.5, borderColor: theme.colors.background.tertiary }} />
                    )}
                  </Box>
                ))}
                {renderActions && (
                  <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${theme.colors.background.tertiary}` }}>
                    {renderActions(row)}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  // Desktop table layout
  return (
    <Paper
      sx={{
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
      }}
      {...props}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.key || index}
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                    backgroundColor: theme.colors.background.tertiary,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {renderActions && (
                <TableCell
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                    backgroundColor: theme.colors.background.tertiary,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  align="center"
                  sx={{ color: theme.colors.text.secondary, py: 4 }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row.id || index}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.key || colIndex}
                      sx={{ color: theme.colors.text.primary }}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell>
                      {renderActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
