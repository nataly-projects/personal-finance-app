import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../hooks/useSettings';
import { Category } from '../utils/types';

interface UserProfile {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const { user, updatePassword, requestPasswordUpdate, verifyPasswordUpdateCode, updateProfile } = useAuth();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { settings } = useSettings();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    // name: user?.email?.split('@')[0] || '',
    name: user?.fullName || '',
    email: user?.email || '',
    newCategoryName: '',
    // newCategoryType: 'expense',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  const userCategories = categories.filter(category => category.userId === user?.id);

  const handleProfileUpdate = async () => {
    try {
      setError(null);
      await updateProfile({
        name: formData.name,
        email: formData.email,
      });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    }
  };

  const handleCategorySubmit = async () => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory._id, {
          name: formData.newCategoryName,
          // type: formData.newCategoryType as 'income' | 'expense'
        });
      } else {
        await addCategory({
          name: formData.newCategoryName,
          // type: formData.newCategoryType as 'income' | 'expense'
        });
      }
      setSuccess('Category updated successfully');
      setIsCategoryDialogOpen(false);
      setSelectedCategory(null);
      setFormData(prev => ({ ...prev, newCategoryName: '' }));
    } catch (err) {
      setError('Error updating category');
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
        setSuccess('Category and its associated transactions have been deleted successfully');
      } catch (err) {
        setError('Error deleting category');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      newCategoryName: category.name,
      // newCategoryType: category.type
    }));
    setIsCategoryDialogOpen(true);
  };

  const handlePasswordUpdateRequest = async () => {
    try {
      setIsRequestingCode(true);
      setError(null);
      await requestPasswordUpdate();
      setSuccess('Verification code has been sent to your email');
      setIsVerificationDialogOpen(true);
      setIsPasswordDialogOpen(false);
    } catch (err) {
      setError('Error requesting password update. Please try again.');
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerificationCodeSubmit = async () => {
    try {
      setError(null);
      await verifyPasswordUpdateCode(formData.verificationCode);
      setSuccess('Code verified successfully');
      setIsVerificationDialogOpen(false);
      setIsPasswordDialogOpen(true);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await updatePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.verificationCode
      );
      setSuccess('Password updated successfully');
      setIsPasswordDialogOpen(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        verificationCode: ''
      }));
    } catch (err) {
      setError('Error updating password. Please check your current password and verification code.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Personal Details</Typography>
              <IconButton onClick={() => setIsEditing(!isEditing)}>
                <EditIcon />
              </IconButton>
            </Box>
            
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={handleProfileUpdate}>
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography><strong>Name:</strong> {formData.name}</Typography>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Settings</Typography>
            <Typography><strong>Notifications:</strong> {settings.notifications ? 'Enabled' : 'Disabled'}</Typography>
            <Typography><strong>Outcome Limit:</strong> ${settings.outcomeLimit}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Password Update</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              To update your password, click the button below. A verification code will be sent to your email address.
            </Typography>
            <Button
              variant="contained"
              startIcon={<LockIcon />}
              onClick={() => setIsPasswordDialogOpen(true)}
              fullWidth
            >
              Update Password
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Your Categories</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedCategory(null);
                  setFormData(prev => ({ ...prev, newCategoryName: '' }));
                  setIsCategoryDialogOpen(true);
                }}
              >
                Add Category
              </Button>
            </Box>
            
            {userCategories.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                You haven't created any categories yet. Click "Add Category" to create your first one.
              </Typography>
            ) : (
              <List>
                {userCategories.map((category) => (
                  <ListItem
                    key={category._id}
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" onClick={() => handleEditCategory(category)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteCategory(category._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={category.name}
                      secondary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {/* <Typography component="span" variant="body2">
                            {category.type === 'income' ? 'Income' : 'Expense'}
                          </Typography> */}
                          <Typography component="span" variant="body2" color="text.secondary">
                            • Created: {new Date(category.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Password Update Dialog */}
      <Dialog open={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)}>
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
      </Dialog>

      {/* Verification Code Dialog */}
      <Dialog open={isVerificationDialogOpen} onClose={() => setIsVerificationDialogOpen(false)}>
        <DialogTitle>Enter Verification Code</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter the verification code sent to your email address.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Verification Code"
            fullWidth
            value={formData.verificationCode}
            onChange={(e) => setFormData(prev => ({ ...prev, verificationCode: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsVerificationDialogOpen(false);
            setFormData(prev => ({ ...prev, verificationCode: '' }));
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleVerificationCodeSubmit} 
            variant="contained"
            disabled={!formData.verificationCode}
          >
            Verify Code
          </Button>
        </DialogActions>
      </Dialog>

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
          {/* <TextField
            select
            margin="dense"
            label="Type"
            fullWidth
            value={formData.newCategoryType}
            onChange={(e) => setFormData(prev => ({ ...prev, newCategoryType: e.target.value }))}
            SelectProps={{ native: true }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </TextField> */}
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