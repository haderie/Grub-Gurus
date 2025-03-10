import React from 'react';
import './index.css';
import { Button } from '@mui/material';
import useProfileSettings from '../../hooks/useProfileSettings';
import ProfileEdit from './profileEdit';

const ProfileSettings: React.FC = () => {
  const {
    userData,
    loading,
    editBioMode,
    newBio,
    newPassword,
    confirmNewPassword,
    successMessage,
    errorMessage,
    showConfirmation,
    pendingAction,
    canEditProfile,
    showPassword,
    togglePasswordVisibility,

    setEditBioMode,
    setNewBio,
    setNewPassword,
    setConfirmNewPassword,
    setShowConfirmation,

    handleResetPassword,
    handleUpdateBiography,
    handleDeleteUser,
  } = useProfileSettings();

  if (loading) {
    return (
      <div className='page-container'>
        <div className='profile-card'>
          <h2>Loading user data...</h2>
        </div>
      </div>
    );
  }

  const handleEditProfileClick = () => {
    setEditBioMode(true); // Close the ProfileEdit modal
    setNewBio(userData?.biography || '');
  };

  return (
    <div>
      {!editBioMode && (
        <div className='page-container'>
          <div className='profile-card'>
            <h2>Profile</h2>
            {canEditProfile && (
              <Button variant='contained' onClick={handleEditProfileClick}>
                Edit Profile
              </Button>
            )}
            {successMessage && <p className='success-message'>{successMessage}</p>}
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            {userData ? (
              <>
                <h4>General Information</h4>
                <p>
                  <strong>Username:</strong> {userData.username}
                </p>
                <p>
                  <strong>Followers:</strong> {userData.followers?.length}
                </p>
                <p>
                  <strong>Following:</strong> {userData.following?.length}
                </p>

                {/* ---- Biography Section ---- */}
                {!editBioMode && (
                  <p>
                    <strong>Biography:</strong> {userData.biography || 'No biography yet.'}
                  </p>
                )}

                <p>
                  <strong>Date Joined:</strong>{' '}
                  {userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : 'N/A'}
                </p>

                {/* ---- Danger Zone (Delete User) ---- */}
              </>
            ) : (
              <p>No user data found. Make sure the username parameter is correct.</p>
            )}

            {/* ---- Confirmation Modal for Delete ---- */}
          </div>
        </div>
      )}
      <div className='page-container'>
        {editBioMode && canEditProfile && (
          <ProfileEdit
            userData={userData}
            loading={loading}
            editBioMode={editBioMode}
            newBio={newBio}
            newPassword={newPassword}
            confirmNewPassword={confirmNewPassword}
            successMessage={successMessage}
            errorMessage={errorMessage}
            showConfirmation={showConfirmation}
            pendingAction={pendingAction}
            canEditProfile={canEditProfile}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            setEditBioMode={setEditBioMode}
            setNewBio={setNewBio}
            setNewPassword={setNewPassword}
            setConfirmNewPassword={setConfirmNewPassword}
            setShowConfirmation={setShowConfirmation}
            handleResetPassword={handleResetPassword}
            handleUpdateBiography={handleUpdateBiography}
            handleDeleteUser={handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
