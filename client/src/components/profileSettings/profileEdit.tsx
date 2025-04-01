import { Button } from '@mui/material';
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
    <div className='profile-card'>
      <h2>Edit your profile!</h2>
      <Button variant='contained' onClick={handleCloseProfileEdit}>
        Return to Profile
      </Button>
      {successMessage && <p className='success-message'>{successMessage}</p>}
      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {userData ? (
        <>
          <h4>General Information</h4>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
          <p>
            <strong>Account Privacy:</strong> {userData.privacySetting}
          </p>
          {/* ---- Account Privacy Section ---- */}
          {editBioMode && canEditProfile && (
            <button
              onClick={async () => {
                const newSetting = userData.privacySetting === 'Public' ? 'Private' : 'Public';
                setPrivacySetting(newSetting);
                await handleUpdatePrivacy(newSetting);
                await handleCheckPrivacy();
              }}>
              {userData.privacySetting === 'Public'
                ? 'Make Account Private'
                : 'Make Account Public'}
            </button>
          )}
          <p>
            <strong>Followers:</strong> {userData.followers?.length}
          </p>
          <p>
            <strong>Following:</strong> {userData.following?.length}
          </p>
          {/* ---- Biography Section ---- */}
          <div style={{ margin: '1rem 0' }}>
            <input
              className='input-text'
              type='text'
              value={newBio}
              onChange={e => setNewBio(e.target.value)}
            />
            <button
              className='login-button'
              style={{ marginLeft: '1rem' }}
              onClick={handleUpdateBiography}>
              Save
            </button>
            <button
              className='delete-button'
              style={{ marginLeft: '1rem' }}
              onClick={handleCloseProfileEdit}>
              Cancel
            </button>
          </div>
          <p>
            <strong>Date Joined:</strong>{' '}
            {userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : 'N/A'}
          </p>
          {/* ---- Reset Password Section ---- */}
          {canEditProfile && (
            <>
              <h4>Reset Password</h4>
              <input
                className='input-text'
                type={showPassword ? 'text' : 'password'}
                placeholder='New Password'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input
                className='input-text'
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm New Password'
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
              />
              <button className='toggle-password-button' onClick={togglePasswordVisibility}>
                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
              </button>
              <button className='login-button' onClick={handleResetPassword}>
                Reset
              </button>
            </>
          )}
          {/* ---- Danger Zone (Delete User) ---- */}
          {canEditProfile && (
            <>
              <h4>Danger Zone</h4>
              <button className='delete-button' onClick={handleDeleteUser}>
                Delete This User
              </button>
            </>
          )}
        </>
      ) : (
        <p>No user data found. Make sure the username parameter is correct.</p>
      )}

      {/* ---- Confirmation Modal for Delete ---- */}
      {showConfirmation && (
        <div className='modal'>
          <div className='modal-content'>
            <p>
              Are you sure you want to delete user <strong>{userData?.username}</strong>? This
              action cannot be undone.
            </p>
            <button className='delete-button' onClick={() => pendingAction && pendingAction()}>
              Confirm
            </button>
            <button className='cancel-button' onClick={() => setShowConfirmation(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
