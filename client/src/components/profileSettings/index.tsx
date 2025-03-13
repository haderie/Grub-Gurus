import React, { useEffect } from 'react';
import './index.css';
import { Button } from '@mui/material';
import useProfileSettings from '../../hooks/useProfileSettings';
import ProfileEdit from './profileEdit';
import useUserRecipes from '../../hooks/useUserRecipes';
import RecipeBook from '../main/recipeBook';

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
    showLists,
    pendingAction,
    canEditProfile,
    selectedOption,
    showPassword,
    privacySetting,
    togglePasswordVisibility,
    setEditBioMode,
    setNewBio,
    setNewPassword,
    setShowLists,
    setConfirmNewPassword,
    setShowConfirmation,
    setPrivacySetting,
    handleRadioChange,
    handleResetPassword,
    handleUpdateBiography,
    handleDeleteUser,
    handleUpdateFollowers,
    isFollowing,
    handleUpdatePrivacy,
    handleCheckPrivacy,
    isRecipePublic,
    toggleRecipeBookVisibility,
  } = useProfileSettings();

  const { recipes, loading: recipesLoading } = useUserRecipes(userData?.username ?? '');
  useEffect(() => {
    const checkPrivacy = async () => {
      if (userData) {
        await handleCheckPrivacy();
      }
    };

    checkPrivacy();
  }, [userData, handleCheckPrivacy]);

  if (loading || recipesLoading) {
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

  const selectedList = selectedOption === 'followers' ? userData?.followers : userData?.following;
  return (
    <div>
      {!editBioMode && (
        <div className='page-container'>
          <div className='profile-card'>
            <h2>Profile</h2>
            <h2>Recipe Book status {userData?.recipeBookPublic ? 'Public' : 'private'}</h2>

            {/* ---- Follow / Unfollow Button ---- */}
            {!canEditProfile && (
              <Button variant='contained' onClick={handleUpdateFollowers}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
            {canEditProfile && (
              <>
                <Button variant='contained' onClick={handleEditProfileClick}>
                  Edit Profile
                </Button>
                <Button variant='contained' onClick={toggleRecipeBookVisibility}>
                  {isRecipePublic ? 'Public' : 'Private'}
                </Button>
              </>
            )}
            {successMessage && <p className='success-message'>{successMessage}</p>}
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            {userData ? (
              <>
                <h4>General Information</h4>
                <p>
                  <b>Username:</b> {userData.username}
                </p>
                <p>
                  <strong>Account Privacy:</strong> {userData.privacySetting}
                </p>
                <p>
                  <strong>Followers:</strong> {userData.followers?.length}
                </p>
                <p>
                  <strong>Following:</strong> {userData.following?.length}
                </p>

                {/* ---- Biography Section ---- */}
                <p>
                  <strong>Biography:</strong> {userData.biography || 'No biography yet.'}
                </p>
                <p>
                  <strong>Date Joined:</strong>{' '}
                  {userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : 'N/A'}
                </p>
              </>
            ) : (
              <p>No user data found. Make sure the username parameter is correct.</p>
            )}

            <div>
              <input
                type='radio'
                name='followStatus'
                id='followers'
                value='followers'
                checked={selectedOption === 'followers'}
                onChange={handleRadioChange}
              />
              <label htmlFor='followers'>Followers</label>
              <input
                type='radio'
                name='followStatus'
                id='following'
                value='following'
                checked={selectedOption === 'following'}
                onChange={handleRadioChange}
              />
              <label htmlFor='following'>Following</label>
              {(canEditProfile || showLists) && (
                <div>
                  {selectedList && selectedList.length > 0 ? (
                    <ul>
                      {selectedList.map((username: string, index: number) => (
                        <li key={index}>{username}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No {selectedOption} yet.</p>
                  )}
                </div>
              )}
              {/* Display based on selected option */}
              {/* <div>
                {selectedList && selectedList.length > 0 ? (
                  <ul>
                    {selectedList.map((username: string, index: number) => (
                      <li key={index}>{username}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No {selectedOption} yet.</p>
                )}
              </div> */}
            </div>
          </div>
        </div>
      )}
      {/* ---- Edit section ---- */}

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
      {(isRecipePublic || canEditProfile) && (
        <>
          <div style={{ textAlign: 'center' }}>
            {/* Recipe Book Section */}
            <h3>Recipe Book</h3>
          </div>
          <div>{recipesLoading ? <p>Loading recipes...</p> : <RecipeBook recipes={recipes} />}</div>
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
