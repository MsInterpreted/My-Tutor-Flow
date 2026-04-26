import React, { useRef } from 'react';
import {
  Paper,
  Box,
  List,
  ListItem,
  Button,
  IconButton,
  Tooltip,
  Input,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../theme/ThemeContext';

export default function DocumentsList({ documents, studentId, reload }) {
  const theme = useTheme();
  const fileInputRef = useRef();
  const [uploading, setUploading] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState(null);

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      const { getStorage, ref: storageRef, uploadBytes } = await import('firebase/storage');
      const storage = getStorage();
      const stRef = storageRef(storage, `student_documents/${studentId}/${uploadFile.name}`);
      await uploadBytes(stRef, uploadFile);
      setUploading(false);
      setUploadFile(null);
      reload();
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
      // You might want to show an error message to the user here
    }
  };

  const handleDocDelete = async fullPath => {
    try {
      const { getStorage, ref: storageRef, deleteObject } = await import('firebase/storage');
      const storage = getStorage();
      await deleteObject(storageRef(storage, fullPath));
      reload();
    } catch (error) {
      console.error('Error deleting file:', error);
      // You might want to show an error message to the user here
    }
  };

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
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
          }}
        >
          Student Documents
        </Typography>
        <Tooltip title="Upload Document">
          <IconButton
            component="label"
            sx={{
              color: theme.colors.brand.primary,
              '&:hover': {
                backgroundColor: `${theme.colors.brand.primary}20`,
              },
            }}
          >
            <UploadFileIcon />
            <Input
              type="file"
              inputRef={fileInputRef}
              sx={{ display: 'none' }}
              onChange={e => setUploadFile(e.target.files[0])}
            />
          </IconButton>
        </Tooltip>
        {uploadFile && (
          <Button
            variant="contained"
            size="small"
            sx={{
              ml: 2,
              backgroundColor: theme.colors.brand.primary,
              color: '#000000',
              '&:hover': {
                backgroundColor: theme.colors.brand.primary,
                opacity: 0.8,
              },
            }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : `Upload: ${uploadFile.name}`}
          </Button>
        )}
      </Box>
      {documents.length === 0 ? (
        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
          No documents uploaded yet.
        </Typography>
      ) : (
        <List dense>
          {documents.map(doc => (
            <ListItem key={doc.name} sx={{ px: 0, display: 'flex', alignItems: 'center' }}>
              {doc.accessible && doc.url ? (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.colors.brand.primary,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {doc.name}
                </a>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.colors.text.secondary,
                      fontStyle: 'italic',
                    }}
                  >
                    {doc.name}
                  </Typography>
                  <Tooltip title={doc.error || 'Document not accessible due to CORS policy'}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.colors.error || '#f44336',
                        fontSize: '0.7rem',
                      }}
                    >
                      (Access Error)
                    </Typography>
                  </Tooltip>
                </Box>
              )}
              <IconButton
                edge="end"
                size="small"
                color="error"
                sx={{ ml: 1 }}
                onClick={() => handleDocDelete(doc.fullPath)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
