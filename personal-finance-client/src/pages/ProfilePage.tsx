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
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Lock as LockIcon, Category as CategoryIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../hooks/useSettings';
import { Category } from '../utils/types';
import PasswordUpdateDialog from '../components/PasswordUpdateDialog';


const ProfilePage: React.FC = () => {
  const { user, updatePassword, requestPasswordUpdate, verifyPasswordUpdateCode, updateProfile } = useAuth();
  const { categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    loading,
    isAdding,
    isUpdating,
    addError,
    updateError } = useCategories();
  const { settings } = useSettings();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newCategoryName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    verificationCode: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.fullName || '', email: user.email || '' }));
    }
  }, [user]);

  const showMessage = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };


  const userCategories = categories.filter(category => category.userId === user?.id);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
      });
      showMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      showMessage(err.message || 'Error updating profile', 'error');
    }
  };

  const handleCategorySubmit = async () => {
    try {
      if (selectedCategory) {
          await updateCategory({id: selectedCategory._id, updatedData:{
            name: formData.newCategoryName,
          }});
      } else {
        await addCategory({
          name: formData.newCategoryName,
        });
      }
      showMessage(`Category ${selectedCategory ? 'updated' : 'added'} successfully`);
      setIsCategoryDialogOpen(false);
      setSelectedCategory(null);
      setFormData(prev => ({ ...prev, newCategoryName: '' }));
    } catch (err) {
      showMessage('Error saving category', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    if (!category) return;

    const confirmMessage = `Are you sure you want to delete the category "${category.name}"?\n\n` +
      'Warning: This will also delete all transactions associated with this category.\n' +
      'This action cannot be undone.';
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteCategory(categoryId);
        showMessage('Category and its associated transactions have been deleted successfully');
      } catch (err) {
        showMessage('Error while deleting category', 'error');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      newCategoryName: category.name,
    }));
    setIsCategoryDialogOpen(true);
  };

  const handlePasswordUpdateRequest = async () => {
    try {
      await requestPasswordUpdate();
      showMessage('Verification code has been sent to your email');
    } catch (err) {
      showMessage('Error requesting password update. Please try again.', 'error');
    } 
  };

  const handleVerificationCodeSubmit = async (code: string) => {
    try {
      await verifyPasswordUpdateCode(code);
      showMessage('Code verified successfully');
    } catch (err: any) {
      showMessage('Invalid verification code. Please try again.', 'error');
      throw new Error(err.response?.data?.message || 'Invalid verification code');
    }
  };

  const handlePasswordUpdate = async (formData: any) => {
    console.log("Submitting password update with data:", formData);
    try {
      await updatePassword(formData);
      showMessage('Password updated successfully');
      setIsPasswordDialogOpen(false);
    } catch (err) {
      showMessage('Error updating password. Please check your current password.', 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">My Profile</Typography>
          <Typography color="text.secondary">Manage your personal information and preferences</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1 }} /> Personal Details
              </Typography>
              {!isEditing && (
                <Button startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={handleProfileUpdate}>Save Changes</Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancel</Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <LockIcon sx={{ mr: 1 }} /> Security
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Keep your account secure by updating your password regularly.
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<LockIcon />}
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Quick Stats</Typography>
              <Typography variant="body2"><strong>Status:</strong> {settings?.enableOutcomeAlert ? 'Alerts On' : 'Alerts Off'}</Typography>
              <Typography variant="body2"><strong>Monthly Limit:</strong> ${settings?.monthlyOutcomeLimit || 0}</Typography>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" display="flex" alignItems="center">
                <CategoryIcon sx={{ mr: 1 }} /> Custom Categories
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                setSelectedCategory(null);
                setFormData(prev => ({ ...prev, newCategoryName: '' }));
                setIsCategoryDialogOpen(true);
              }}>
                Add Category
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {userCategories.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography color="text.secondary">No custom categories yet.</Typography>
              </Box>
            ) : (
              <List>
                {userCategories.map((category) => (
                  <ListItem
                    key={category._id}
                    divider
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => handleEditCategory(category)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton color="error" onClick={() => handleDeleteCategory(category._id)}><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    }
                  >
                    <ListItemText 
                      primary={category.name} 
                      secondary={`Created: ${new Date(category.createdAt).toLocaleDateString()}`} 
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

       {/* Password Update Dialog */}
      {/* <Dialog open={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            To update your password, a verification code will be sent to your email address.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handlePasswordUpdateRequest}
            disabled={isRequestingCode}
            sx={{ mb: 2 }}
          >
            {isRequestingCode ? 'Sending...' : 'Send Verification Code'}
          </Button>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={formData.currentPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={formData.newPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsPasswordDialogOpen(false);
            setFormData(prev => ({
              ...prev,
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }));
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordUpdate} 
            variant="contained"
            disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog> */}

      <PasswordUpdateDialog 
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onRequestCode={handlePasswordUpdateRequest}
        onVerifyCode={handleVerificationCodeSubmit}
        onUpdatePassword={handlePasswordUpdate}
      />


      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)}>
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={formData.newCategoryName}
            onChange={(e) => setFormData(prev => ({ ...prev, newCategoryName: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCategorySubmit} 
            variant="contained"
            disabled={!formData.newCategoryName.trim()}
          >
            {selectedCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage; 