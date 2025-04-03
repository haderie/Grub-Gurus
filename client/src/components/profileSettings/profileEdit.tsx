import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen'; // This should work once the package is installed
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { SafePopulatedDatabaseUser } from '../../types/types';

const ProfileEdit = ({
  userData,
  loading,
  editBioMode,
  newBio,
  newPassword,
  confirmNewPassword,
  privacySetting,
  successMessage,
  errorMessage,
  showConfirmation,
  pendingAction,
  canEditProfile,
  showPassword,
  isRecipePublic,
  togglePasswordVisibility,
  toggleRecipeBookVisibility,
  setEditBioMode,
  setNewBio,
  setNewPassword,
  setConfirmNewPassword,
  setShowConfirmation,
  setPrivacySetting,
  setShowLists,

  handleResetPassword,
  handleUpdateBiography,
  handleDeleteUser,
  handleUpdatePrivacy,
  handleCheckPrivacy,
}: {
  userData: SafePopulatedDatabaseUser | null;
  loading: boolean;
  editBioMode: boolean;
  newBio: string;
  newPassword: string;
  confirmNewPassword: string;
  privacySetting: 'Public' | 'Private';
  showLists: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  showConfirmation: boolean;
  pendingAction: (() => void) | null;
  canEditProfile: boolean;
  showPassword: boolean;
  isRecipePublic: boolean;
  togglePasswordVisibility: () => void;
  toggleRecipeBookVisibility: () => void;

  setEditBioMode: React.Dispatch<React.SetStateAction<boolean>>;
  setNewBio: React.Dispatch<React.SetStateAction<string>>;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmNewPassword: React.Dispatch<React.SetStateAction<string>>;
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setPrivacySetting: React.Dispatch<React.SetStateAction<'Public' | 'Private'>>;
  setShowLists: React.Dispatch<React.SetStateAction<boolean>>;

  handleResetPassword: () => void;
  handleUpdateBiography: () => void;
  handleDeleteUser: () => void;
  handleUpdatePrivacy: (newSetting: 'Public' | 'Private') => void;
  handleCheckPrivacy: () => void;
}) => {
  const handleCloseProfileEdit = () => {
    setEditBioMode(false);
  };
  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh', // Prevents unwanted overflow
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch', // Makes everything naturally flow left to right
        padding: 4,
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f5',
        marginTop: '-30px',
      }}>
      {/* Header Section: Title + Return Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
          Edit Profile
        </Typography>
        <Button
          variant='contained'
          color='primary'
          sx={{ backgroundColor: '#6A9C89', color: '#FFF5E4', fontSize: '16px' }}
          onClick={() => setEditBioMode(false)}>
          Return to Profile
        </Button>
      </Box>

      {/* Messages */}
      {successMessage && <Typography color='success.main'>{successMessage}</Typography>}
      {errorMessage && <Typography color='error.main'>{errorMessage}</Typography>}

      {userData ? (
        <>
          {/* General Information */}
          <Box sx={{ mt: 3 }}>
            <Typography variant='h6'>General Information</Typography>
            <Typography>
              <strong>Username: @</strong>
              {userData.username}
            </Typography>
            {/* Date Joined */}
            <Typography>
              <strong>Date Joined:</strong>{' '}
              {userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : 'N/A'}
            </Typography>
            <Typography>
              <strong>Account Privacy:</strong> {userData.privacySetting}{' '}
              {canEditProfile && (
                <IconButton
                  size='small'
                  onClick={async () => {
                    const newSetting = userData.privacySetting === 'Public' ? 'Private' : 'Public';
                    setPrivacySetting(newSetting);
                    await handleUpdatePrivacy(newSetting);
                    await handleCheckPrivacy();
                  }}>
                  {userData.privacySetting === 'Public' ? (
                    <LockOpenIcon fontSize='small' />
                  ) : (
                    <LockIcon fontSize='small' />
                  )}
                </IconButton>
              )}
            </Typography>
            <Typography>
              <strong>Followers:</strong> {userData.followers?.length}
            </Typography>
            <Typography>
              <strong>Following:</strong> {userData.following?.length}
            </Typography>
          </Box>

          {/* Biography Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant='h6'>Biography</Typography>
            <TextField
              value={newBio}
              sx={{
                'width': '700px',
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#6A9C89', // Change 'blue' to your desired color
                  },
                },
              }}
              onChange={e => setNewBio(e.target.value)}
              variant='outlined'
              size='small'
            />
            <Button
              variant='contained'
              onClick={handleUpdateBiography}
              sx={{
                marginLeft: '10px',
                backgroundColor: '#6A9C89',
                color: '#FFF5E4',
                fontsize: '16px',
              }}>
              Save
            </Button>
            {/* <Button
              variant='contained'
              sx={{ backgroundColor: '#FFA725', color: '#FFF5E4', fontsize: '16px' }}
              onClick={() => setEditBioMode(false)}>
              Cancel
            </Button> */}
          </Box>

          {/* Reset Password Section */}
          {canEditProfile && (
            <Box sx={{ mt: 3 }}>
              <Typography variant='h6'>Reset Password</Typography>
              <TextField
                type={showPassword ? 'text' : 'password'}
                placeholder='New Password'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                variant='outlined'
                size='small'
                sx={{
                  'mb': 1,
                  'width': '700px',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#6A9C89', // Change 'blue' to your desired color
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm New Password'
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                variant='outlined'
                size='small'
                sx={{
                  'width': '700px',
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#6A9C89', // Change 'blue' to your desired color
                    },
                  },
                }}
              />
              <Button
                variant='contained'
                sx={{
                  marginLeft: '10px',
                  backgroundColor: '#6A9C89',
                  color: '#FFF5E4',
                  fontsize: '16px',
                }}
                onClick={handleResetPassword}>
                Reset
              </Button>
            </Box>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={togglePasswordVisibility}
                sx={{
                  color: ' #3E3232',
                  marginRight: 0,
                }}
              />
            }
            label={showPassword ? 'Hide Password' : 'Show Password'}
            sx={{
              mt: 1,
              color: ' #3E3232',
              fontSize: '14px',
            }}
          />
          {/* Danger Zone */}
          {canEditProfile && (
            <Box sx={{ mt: 4, borderTop: '1px solid #ddd', paddingTop: 2 }}>
              <Typography variant='h6' color='error'>
                Danger Zone
              </Typography>
              <Button
                variant='contained'
                color='error'
                sx={{ marginTop: 1 }}
                onClick={handleDeleteUser}>
                Delete Profile
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Typography>No user data found. Make sure the username parameter is correct.</Typography>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{userData?.username}</strong>? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => pendingAction && pendingAction()} color='error'>
            Confirm
          </Button>
          <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileEdit;
