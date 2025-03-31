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

  const handleEditProfileClick = () => {
    setEditBioMode(true);
    setNewBio(userData?.biography || '');
  };

  let selectedList: { title: string; username: string }[] = [];
  let recipeSaved: PopulatedDatabaseRecipe[] = [];

  switch (selectedOption) {
    case 'recipes':
      recipeSaved = userData?.postsCreated?.map(post => post.recipe) || [];
      break;
    case 'posts':
      selectedList =
        userData?.postsCreated?.map(post => ({
          title: post.recipe?.title,
          username: post.username,
        })) || [];
      break;
    default:
      selectedList = [];
      break;
  }

  const handleRatingChange = (item: string, rating: number) => {
    // Ensure the rank is unique
    if (!usedRankings.has(rating)) {
      setUserRankings(prevRatings => {
        const newRatings = { ...prevRatings, [item]: rating };
        return newRatings;
      });
      setUsedRankings(prevUsed => new Set(prevUsed.add(rating))); // Add the new rating to used ranks
    } else {
      // eslint-disable-next-line no-alert
      alert('This ranking is already taken. Please choose another.');
    }
  };
  const handleRemoveRating = (id: string) => {
    const rating = userRankings[id];
    if (rating !== undefined) {
      // Remove the rating from the used rankings set
      setUsedRankings(prevUsed => {
        const updatedUsed = new Set(prevUsed);
        updatedUsed.delete(rating); // Remove the rating from the used set
        return updatedUsed;
      });

      // Return the rating to the available rankings list
      setAvailableRankings(prevRankings => {
        // Only add the rating if it is not already in the available list
        if (!prevRankings.includes(rating)) {
          return [...prevRankings, rating];
        }
        return prevRankings;
      });

      // Remove the rating from the selected rankings
      setUserRankings(prevRankings => {
        const updatedRankings = { ...prevRankings };
        delete updatedRankings[id]; // Remove the ranking for the given ID
        return updatedRankings;
      });
    }
  };

  const sortedList: SortedItem[] =
    selectedOption === 'posts'
      ? selectedList
          .map(({ title, username }) => ({
            item: title,
            username, // Ensure user is included
            rating: userRankings[title] || 0,
          }))
          .sort((a, b) => {
            if (a.rating === 0 && b.rating !== 0) return 1; // Push unranked items down
            if (a.rating !== 0 && b.rating === 0) return -1; // Keep ranked items up
            return a.rating - b.rating; // Sort by rating
          })
      : recipeSaved
          .map(recipe => ({
            item: recipe.title,
            username: recipe.user.username, // Ensure user is included
            rating: userRankings[recipe.title] || 0,
          }))
          .sort((a, b) => a.rating - b.rating);

  useEffect(() => {
    const totalItems = sortedList.length; // Get the number of items
    setAvailableRankings(Array.from({ length: totalItems }, (_, i) => i + 1)); // Generate rankings from 1 to totalItems
  }, [sortedList.length]); // Recalculate whenever sortedList changes

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
          privacySetting={privacySetting}
          setPrivacySetting={setPrivacySetting}
          showLists={showLists}
          setShowLists={setShowLists}
          handleUpdatePrivacy={handleUpdatePrivacy}
          handleCheckPrivacy={handleCheckPrivacy}
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
