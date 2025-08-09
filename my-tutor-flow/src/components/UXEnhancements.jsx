import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardArrowUp,
  Search,
  FilterList,
  Undo,
  Redo,
  Keyboard,
  Close,
  DragIndicator,
  CloudUpload,
  CheckCircle,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import {
  useKeyboardShortcuts,
  useUndoRedo,
  useDragAndDrop,
  useQuickFilters,
} from '../hooks/useKeyboardShortcuts';

const UXEnhancements = ({ children }) => {
  const theme = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts({
    'ctrl+shift+k': () => setShowShortcuts(true),
    'ctrl+shift+h': () => showNotification('Keyboard shortcuts: Ctrl+Shift+K', 'info'),
  });

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global event listeners for shortcuts
  useEffect(() => {
    const handleShortcutEvents = event => {
      switch (event.type) {
        case 'shortcut:search':
          const searchInput = document.querySelector(
            'input[placeholder*="Search"], input[placeholder*="search"]'
          );
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
          break;
        case 'shortcut:escape':
          // Close any open modals or dialogs
          const closeButtons = document.querySelectorAll(
            '[aria-label="close"], [data-testid="CloseIcon"]'
          );
          if (closeButtons.length > 0) {
            closeButtons[0].click();
          }
          break;
        case 'shortcut:toggle-theme':
          const themeToggle = document.querySelector('[data-testid="theme-toggle"]');
          if (themeToggle) {
            themeToggle.click();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('shortcut:search', handleShortcutEvents);
    window.addEventListener('shortcut:escape', handleShortcutEvents);
    window.addEventListener('shortcut:toggle-theme', handleShortcutEvents);

    return () => {
      window.removeEventListener('shortcut:search', handleShortcutEvents);
      window.removeEventListener('shortcut:escape', handleShortcutEvents);
      window.removeEventListener('shortcut:toggle-theme', handleShortcutEvents);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const showNotification = (message, severity = 'info', duration = 4000) => {
    const id = Date.now();
    const notification = {
      id,
      message,
      severity,
      open: true,
    };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const closeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const keyboardShortcutsList = [
    { keys: 'Ctrl + 1', description: 'Go to Dashboard' },
    { keys: 'Ctrl + 2', description: 'Go to Students' },
    { keys: 'Ctrl + 3', description: 'Go to Attendance' },
    { keys: 'Ctrl + 4', description: 'Go to Billing' },
    { keys: 'Ctrl + 5', description: 'Go to Reports' },
    { keys: 'Ctrl + 6', description: 'Go to Business Dashboard' },
    { keys: 'Ctrl + N', description: 'Create New Item' },
    { keys: 'Ctrl + S', description: 'Save Current Form' },
    { keys: 'Ctrl + F', description: 'Focus Search' },
    { keys: 'Ctrl + Z', description: 'Undo Last Action' },
    { keys: 'Ctrl + Y', description: 'Redo Last Action' },
    { keys: 'Escape', description: 'Close Modal/Dialog' },
    { keys: 'Ctrl + Shift + D', description: 'Toggle Dark/Light Mode' },
    { keys: 'Ctrl + Shift + K', description: 'Show Keyboard Shortcuts' },
  ];

  return (
    <>
      {children}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="medium"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: theme.colors.brand.primary,
            color: '#000000',
            '&:hover': {
              backgroundColor: theme.colors.brand.primary,
              opacity: 0.8,
            },
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}

      {/* Keyboard Shortcuts Help Button */}
      <Tooltip title="Keyboard Shortcuts (Ctrl+Shift+K)">
        <Fab
          size="small"
          onClick={() => setShowShortcuts(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: showScrollTop ? 104 : 24,
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            '&:hover': {
              backgroundColor: theme.colors.background.secondary,
              opacity: 0.8,
            },
            zIndex: 1000,
          }}
        >
          <Keyboard />
        </Fab>
      </Tooltip>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: theme.colors.brand.primary,
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open={isLoading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ color: theme.colors.brand.primary }}>
            Processing...
          </Typography>
        </Box>
      </Backdrop>

      {/* Notifications */}
      {notifications.map(notification => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert
            severity={notification.severity}
            onClose={() => closeNotification(notification.id)}
            sx={{
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              '& .MuiAlert-icon': {
                color: theme.colors.brand.primary,
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}

      {/* Keyboard Shortcuts Dialog */}
      <Dialog
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.colors.text.primary,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Keyboard sx={{ color: theme.colors.brand.primary }} />
            Keyboard Shortcuts
          </Box>
          <IconButton
            onClick={() => setShowShortcuts(false)}
            sx={{ color: theme.colors.text.secondary }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {keyboardShortcutsList.map((shortcut, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <Chip
                      label={shortcut.keys}
                      size="small"
                      sx={{
                        backgroundColor: theme.colors.brand.primary + '20',
                        color: theme.colors.brand.primary,
                        fontFamily: 'monospace',
                        fontWeight: 600,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={shortcut.description}
                    sx={{ color: theme.colors.text.primary }}
                  />
                </ListItem>
                {index < keyboardShortcutsList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Quick Filter Component
export const QuickFilterBar = ({
  data,
  filterConfig,
  onFilteredData,
  placeholder = 'Search...',
}) => {
  const theme = useTheme();
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    activeFilters,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useQuickFilters(data, filterConfig);

  useEffect(() => {
    onFilteredData(filteredData);
  }, [filteredData, onFilteredData]);

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '12px',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder={placeholder}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.colors.text.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />

        {filterConfig.filters &&
          Object.entries(filterConfig.filters).map(([key, config]) => (
            <TextField
              key={key}
              size="small"
              select
              label={config.label}
              value={activeFilters[key] || ''}
              onChange={e => setFilter(key, e.target.value)}
              sx={{ minWidth: 120 }}
              SelectProps={{ native: true }}
            >
              <option value="">All</option>
              {config.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          ))}

        {hasActiveFilters && (
          <Chip
            label={`Clear Filters (${Object.keys(activeFilters).length + (searchTerm ? 1 : 0)})`}
            onDelete={clearAllFilters}
            deleteIcon={<Close />}
            sx={{
              backgroundColor: theme.colors.brand.primary + '20',
              color: theme.colors.brand.primary,
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

// Drag and Drop Zone Component
export const DragDropZone = ({
  onDrop,
  acceptedTypes = ['*'],
  multiple = false,
  children,
  className = '',
}) => {
  const theme = useTheme();
  const { isDragging, dragProps } = useDragAndDrop(onDrop, {
    acceptedTypes,
    multiple,
  });

  return (
    <Box
      {...dragProps}
      className={className}
      sx={{
        position: 'relative',
        border: `2px dashed ${isDragging ? theme.colors.brand.primary : theme.colors.text.secondary}`,
        borderRadius: '12px',
        p: 3,
        backgroundColor: isDragging ? theme.colors.brand.primary + '10' : 'transparent',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: theme.colors.brand.primary,
          backgroundColor: theme.colors.brand.primary + '05',
        },
      }}
    >
      {isDragging && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.brand.primary + '20',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CloudUpload
              sx={{
                fontSize: 48,
                color: theme.colors.brand.primary,
                mb: 1,
              }}
            />
            <Typography variant="h6" sx={{ color: theme.colors.brand.primary }}>
              Drop files here
            </Typography>
          </Box>
        </Box>
      )}
      {children}
    </Box>
  );
};

// Undo/Redo Controls Component
export const UndoRedoControls = ({ undoRedoState }) => {
  const theme = useTheme();
  const { undo, redo, canUndo, canRedo } = undoRedoState;

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Undo (Ctrl+Z)">
        <IconButton
          onClick={undo}
          disabled={!canUndo}
          size="small"
          sx={{
            color: canUndo ? theme.colors.text.primary : theme.colors.text.disabled,
            '&:hover': {
              backgroundColor: theme.colors.brand.primary + '20',
            },
          }}
        >
          <Undo />
        </IconButton>
      </Tooltip>

      <Tooltip title="Redo (Ctrl+Y)">
        <IconButton
          onClick={redo}
          disabled={!canRedo}
          size="small"
          sx={{
            color: canRedo ? theme.colors.text.primary : theme.colors.text.disabled,
            '&:hover': {
              backgroundColor: theme.colors.brand.primary + '20',
            },
          }}
        >
          <Redo />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UXEnhancements;
