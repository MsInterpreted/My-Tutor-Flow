import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Button,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  Refresh,
  Download,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { useVirtualizedList, usePagination, useDebouncedSearch } from '../hooks/useVirtualizedList';
import cachedDataService from '../services/cachedDataService';

const EnhancedDataTable = ({
  dataType = 'students',
  columns = [],
  onRowClick = null,
  onRowSelect = null,
  selectable = false,
  searchable = true,
  filterable = true,
  exportable = true,
  virtualizeRows = false,
  itemsPerPage = 20,
  height = 600,
  title = 'Data Table',
}) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  // Search functionality
  const searchFunction = useCallback(
    async searchTerm => {
      if (dataType === 'students') {
        return await cachedDataService.searchStudents(searchTerm);
      }
      // Add other data types as needed
      return [];
    },
    [dataType]
  );

  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    results: searchResults,
  } = useDebouncedSearch(searchFunction, 300);

  // Pagination
  const {
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getPageItems,
  } = usePagination({
    totalItems: data.length,
    itemsPerPage,
    initialPage: 1,
  });

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let result;

      if (searchTerm && searchResults.length > 0) {
        result = searchResults;
      } else {
        switch (dataType) {
          case 'students':
            result = await cachedDataService.getPaginatedStudents(currentPage, itemsPerPage, {
              search: searchTerm,
              ...filters,
            });
            setData(result.items);
            break;
          case 'invoices':
            result = await cachedDataService.getAllInvoices();
            setData(result);
            break;
          case 'attendance':
            result = await cachedDataService.getAllAttendance();
            setData(result);
            break;
          default:
            setData([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dataType, currentPage, itemsPerPage, searchTerm, searchResults, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Filtering
  const filteredData = useMemo(() => {
    return sortedData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key];
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return itemValue === value;
      });
    });
  }, [sortedData, filters]);

  // Pagination for filtered data
  const paginatedData = useMemo(() => {
    return getPageItems(filteredData);
  }, [filteredData, getPageItems]);

  // Virtualization (if enabled)
  const { visibleItems, totalHeight, handleScroll, setContainerRef } = useVirtualizedList({
    items: virtualizeRows ? paginatedData : [],
    itemHeight: 60,
    containerHeight: height - 200,
    overscan: 5,
  });

  const displayData = virtualizeRows ? visibleItems : paginatedData;

  // Event handlers
  const handleSort = columnKey => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleRowSelect = rowId => {
    if (!selectable) return;

    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);

    if (onRowSelect) {
      onRowSelect(Array.from(newSelected));
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === displayData.length) {
      setSelectedRows(new Set());
      if (onRowSelect) onRowSelect([]);
    } else {
      const allIds = new Set(displayData.map(item => item.id));
      setSelectedRows(allIds);
      if (onRowSelect) onRowSelect(Array.from(allIds));
    }
  };

  const handleFilterChange = (columnKey, value) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value,
    }));
  };

  const handleColumnVisibilityToggle = columnKey => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleExport = () => {
    // Simple CSV export
    const visibleCols = columns.filter(col => visibleColumns[col.key]);
    const headers = visibleCols.map(col => col.label).join(',');
    const rows = filteredData
      .map(item =>
        visibleCols
          .map(col => {
            const value = item[col.key];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          })
          .join(',')
      )
      .join('\n');

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderCell = (item, column) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value || 0);
    }

    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString() : '-';
    }

    if (column.type === 'boolean') {
      return (
        <Chip label={value ? 'Yes' : 'No'} size="small" color={value ? 'success' : 'default'} />
      );
    }

    return value || '-';
  };

  return (
    <Paper
      sx={{
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        boxShadow: theme.shadows.card,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={loadData} sx={{ color: theme.colors.brand.primary }}>
                <Refresh />
              </IconButton>
            </Tooltip>

            {exportable && (
              <Tooltip title="Export Data">
                <IconButton onClick={handleExport} sx={{ color: theme.colors.brand.primary }}>
                  <Download />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Column Visibility">
              <IconButton sx={{ color: theme.colors.brand.primary }}>
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {searchable && (
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {isSearching ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Search sx={{ color: theme.colors.text.secondary }} />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}

          {filterable &&
            columns
              .filter(col => col.filterable)
              .map(column => (
                <FormControl key={column.key} size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>{column.label}</InputLabel>
                  <Select
                    value={filters[column.key] || ''}
                    onChange={e => handleFilterChange(column.key, e.target.value)}
                    label={column.label}
                  >
                    <MenuItem value="">All</MenuItem>
                    {column.filterOptions?.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}

          {selectedRows.size > 0 && (
            <Chip
              label={`${selectedRows.size} selected`}
              onDelete={() => setSelectedRows(new Set())}
              sx={{
                backgroundColor: theme.colors.brand.primary + '20',
                color: theme.colors.brand.primary,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          height: virtualizeRows ? height - 200 : 'auto',
          maxHeight: virtualizeRows ? 'none' : height - 200,
        }}
        ref={virtualizeRows ? setContainerRef : null}
        onScroll={virtualizeRows ? handleScroll : null}
      >
        {loading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.size === displayData.length && displayData.length > 0}
                      indeterminate={
                        selectedRows.size > 0 && selectedRows.size < displayData.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}

                {columns
                  .filter(col => visibleColumns[col.key])
                  .map(column => (
                    <TableCell
                      key={column.key}
                      sx={{
                        color: theme.colors.text.secondary,
                        fontWeight: 600,
                        cursor: column.sortable ? 'pointer' : 'default',
                        backgroundColor: theme.colors.background.secondary,
                      }}
                      onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {column.label}
                        {column.sortable && sortConfig.key === column.key && (
                          <Sort
                            sx={{
                              fontSize: 16,
                              transform:
                                sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none',
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>

            <TableBody sx={{ position: virtualizeRows ? 'relative' : 'static' }}>
              {virtualizeRows && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    sx={{ height: totalHeight, padding: 0, border: 'none' }}
                  />
                </TableRow>
              )}

              {displayData.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  hover
                  selected={selectedRows.has(item.id)}
                  onClick={() => onRowClick && onRowClick(item)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    ...(virtualizeRows && item.style),
                    backgroundColor: selectedRows.has(item.id)
                      ? theme.colors.brand.primary + '10'
                      : 'transparent',
                  }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.has(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                        onClick={e => e.stopPropagation()}
                      />
                    </TableCell>
                  )}

                  {columns
                    .filter(col => visibleColumns[col.key])
                    .map(column => (
                      <TableCell key={column.key} sx={{ color: theme.colors.text.primary }}>
                        {renderCell(item, column)}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {!virtualizeRows && (
        <TablePagination
          component="div"
          count={filteredData.length}
          page={currentPage - 1}
          onPageChange={(e, page) => goToPage(page + 1)}
          rowsPerPage={itemsPerPage}
          onRowsPerPageChange={() => {}} // Implement if needed
          sx={{
            borderTop: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            color: theme.colors.text.primary,
          }}
        />
      )}
    </Paper>
  );
};

export default EnhancedDataTable;
