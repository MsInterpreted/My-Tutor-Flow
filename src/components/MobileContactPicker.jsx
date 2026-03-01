import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Contacts as ContactsIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const MobileContactPicker = ({ 
  onContactSelected, 
  fieldType = 'phone', // 'phone', 'email', or 'both'
  buttonText = 'Select from Contacts',
  disabled = false,
  size = 'medium'
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);

  // Check if Contacts API is supported
  const isContactsSupported = () => {
    return 'contacts' in navigator && 'ContactsManager' in window;
  };

  // Request contacts permission and fetch contacts
  const requestContacts = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if Contacts API is supported
      if (!isContactsSupported()) {
        throw new Error('Contacts API is not supported on this device/browser');
      }

      // Define what contact properties we want
      const props = ['name', 'tel'];
      if (fieldType === 'email' || fieldType === 'both') {
        props.push('email');
      }

      // Request contacts with specific properties
      const contactList = await navigator.contacts.select(props, { multiple: true });
      
      if (contactList && contactList.length > 0) {
        // Process and format contacts
        const formattedContacts = contactList.map((contact, index) => ({
          id: index,
          name: contact.name && contact.name.length > 0 ? contact.name[0] : 'Unknown Contact',
          phones: contact.tel || [],
          emails: contact.email || [],
        })).filter(contact => {
          // Filter contacts based on field type
          if (fieldType === 'phone') return contact.phones.length > 0;
          if (fieldType === 'email') return contact.emails.length > 0;
          return contact.phones.length > 0 || contact.emails.length > 0;
        });

        setContacts(formattedContacts);
        setHasPermission(true);
      } else {
        setError('No contacts found or permission denied');
        setHasPermission(false);
      }
    } catch (err) {
      console.error('Error accessing contacts:', err);
      if (err.name === 'NotAllowedError') {
        setError('Permission to access contacts was denied. Please enable contacts permission in your browser settings.');
        setHasPermission(false);
      } else if (err.message.includes('not supported')) {
        setError('Contact picker is not supported on this device. This feature works best on mobile devices with modern browsers.');
      } else {
        setError('Failed to access contacts. Please try again or enter the information manually.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPicker = async () => {
    setOpen(true);
    if (contacts.length === 0) {
      await requestContacts();
    }
  };

  const handleContactSelect = (contact, phone = null, email = null) => {
    const selectedData = {
      name: contact.name,
      phone: phone,
      email: email,
    };

    onContactSelected(selectedData);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  // Render contact item with phone/email options
  const renderContactItem = (contact) => {
    const hasMultiplePhones = contact.phones.length > 1;
    const hasMultipleEmails = contact.emails.length > 1;
    const hasMultipleOptions = hasMultiplePhones || hasMultipleEmails || 
                              (contact.phones.length > 0 && contact.emails.length > 0 && fieldType === 'both');

    if (!hasMultipleOptions) {
      // Simple selection for single phone/email
      const phone = contact.phones[0] || null;
      const email = contact.emails[0] || null;
      
      return (
        <ListItem key={contact.id} disablePadding>
          <ListItemButton
            onClick={() => handleContactSelect(contact, phone, email)}
            sx={{
              borderRadius: '8px',
              mb: 1,
              backgroundColor: theme.colors.background.secondary,
              '&:hover': {
                backgroundColor: theme.colors.brand.primary + '10',
              },
            }}
          >
            <PersonIcon sx={{ color: theme.colors.brand.primary, mr: 2 }} />
            <ListItemText
              primary={contact.name}
              secondary={
                <Box>
                  {phone && (
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      📞 {phone}
                    </Typography>
                  )}
                  {email && (
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      📧 {email}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
      );
    }

    // Multiple options - show expandable list
    return (
      <ListItem key={contact.id} disablePadding>
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <PersonIcon sx={{ color: theme.colors.brand.primary }} />
            {contact.name}
          </Typography>
          
          {/* Phone numbers */}
          {(fieldType === 'phone' || fieldType === 'both') && contact.phones.map((phone, index) => (
            <ListItemButton
              key={`phone-${index}`}
              onClick={() => handleContactSelect(contact, phone, null)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                ml: 2,
                backgroundColor: theme.colors.background.primary,
                '&:hover': {
                  backgroundColor: theme.colors.brand.primary + '10',
                },
              }}
            >
              <PhoneIcon sx={{ color: theme.colors.status.success, mr: 1, fontSize: 20 }} />
              <ListItemText
                primary={phone}
                secondary="Phone"
              />
            </ListItemButton>
          ))}

          {/* Email addresses */}
          {(fieldType === 'email' || fieldType === 'both') && contact.emails.map((email, index) => (
            <ListItemButton
              key={`email-${index}`}
              onClick={() => handleContactSelect(contact, null, email)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                ml: 2,
                backgroundColor: theme.colors.background.primary,
                '&:hover': {
                  backgroundColor: theme.colors.brand.primary + '10',
                },
              }}
            >
              <EmailIcon sx={{ color: theme.colors.brand.primary, mr: 1, fontSize: 20 }} />
              <ListItemText
                primary={email}
                secondary="Email"
              />
            </ListItemButton>
          ))}
        </Box>
      </ListItem>
    );
  };

  return (
    <>
      <Tooltip title={isContactsSupported() ? "Select from mobile contacts" : "Contact picker not supported on this device"}>
        <span>
          <IconButton
            onClick={handleOpenPicker}
            disabled={disabled || !isContactsSupported()}
            size={size}
            sx={{
              color: theme.colors.brand.primary,
              backgroundColor: theme.colors.brand.primary + '10',
              '&:hover': {
                backgroundColor: theme.colors.brand.primary + '20',
              },
              '&:disabled': {
                color: theme.colors.text.secondary,
                backgroundColor: theme.colors.background.secondary,
              },
            }}
          >
            <ContactsIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.colors.background.secondary,
            borderRadius: '16px',
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContactsIcon sx={{ color: theme.colors.brand.primary }} />
            Select Contact
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && contacts.length === 0 && hasPermission === false && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No contacts available. You can enter the information manually or try again after granting contacts permission.
            </Alert>
          )}

          {!loading && contacts.length > 0 && (
            <>
              <Typography
                variant="body2"
                sx={{ color: theme.colors.text.secondary, mb: 2 }}
              >
                Select a contact to auto-fill the {fieldType === 'both' ? 'name and contact' : fieldType} information:
              </Typography>
              <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {contacts.map(renderContactItem)}
              </List>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{ color: theme.colors.text.secondary }}>
            Cancel
          </Button>
          {error && hasPermission === false && (
            <Button
              onClick={requestContacts}
              variant="contained"
              sx={{
                backgroundColor: theme.colors.brand.primary,
                '&:hover': {
                  backgroundColor: theme.colors.brand.primary + 'CC',
                },
              }}
            >
              Try Again
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MobileContactPicker;
