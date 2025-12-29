import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Stack,
  Snackbar,
  Divider
} from '@mui/material';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category: any | null; // הקטגוריה לעריכה (או null להוספה)
  onSave: (name: string) => Promise<void>;
  loading: boolean;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onClose, category, onSave, loading }) => {
  const [name, setName] = useState('');

  // טעינת שם הקטגוריה אם אנחנו בעריכה
  React.useEffect(() => {
    setName(category?.name || '');
  }, [category, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus fullWidth label="Category Name" margin="dense"
          value={name} onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => onSave(name)} variant="contained" 
          disabled={loading || !name.trim()}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};