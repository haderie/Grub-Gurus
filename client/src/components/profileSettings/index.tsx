import React, { useEffect, useState } from 'react';
import './index.css';
import { FaRegUserCircle, FaUnlockAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useProfileSettings from '../../hooks/useProfileSettings';
import useUserRecipes from '../../hooks/useUserRecipes';
import RecipeBook from '../main/recipeBook';
import ProfileEdit from './profileEdit';
import { PopulatedDatabaseRecipe } from '../../types/types';

type SortedItem = {
  item: string; // Recipe title
  rating: number;
  username: string; // Recipe creator
};

const isItem = (obj: SortedItem): obj is { item: string; rating: number; username: string } =>
  (obj as { item: string }).item !== undefined;

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
    setSelectedOption,
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
  const navigate = useNavigate();

  const [userRatings, setUserRatings] = useState<{ [key: string]: number }>({});
  const [availableRatings, setAvailableRatings] = useState<number[]>([1, 2, 3, 4, 5]);

  const [showListPopup, setShowListPopup] = useState(false);
  const [listType, setListType] = useState<'followers' | 'following' | null>(null);

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
          title: post.recipe.title,
          username: post.username,
        })) || [];
      break;
    default:
      selectedList = [];
      break;
  }

  const handleRatingChange = (id: string, rating: number) => {
    // Check if the rating is available and not already selected
    if (availableRatings.includes(rating) && !userRatings[id]) {
      // Update the selected rating for the item
      setUserRatings(prevRatings => ({
        ...prevRatings,
        [id]: rating,
      }));

      // Remove the selected rating from the available ratings
      setAvailableRatings(prevRatings => prevRatings.filter(r => r !== rating));
    }
  };

  const handleRemoveRating = (id: string) => {
    const rating = userRatings[id];
    if (rating !== undefined) {
      // Return the rating to the available ratings list
      setAvailableRatings(prevRatings => [...prevRatings, rating]);

      // Remove the rating from the selected ratings
      setUserRatings(prevRatings => {
        const updatedRatings = { ...prevRatings };
        delete updatedRatings[id];
        return updatedRatings;
      });
    }
  };

  const sortedList: SortedItem[] =
    selectedOption === 'posts'
      ? selectedList
          .map(({ title, username }) => ({
            item: title,
            username, // Ensure user is included
            rating: userRatings[title] || 0,
          }))
          .sort((a, b) => a.rating - b.rating)
      : recipeSaved
          .map(recipe => ({
            item: recipe.title,
            username: recipe.user.username, // Ensure user is included
            rating: userRatings[recipe.title] || 0,
          }))
          .sort((a, b) => a.rating - b.rating);

  if (loading || recipesLoading) {
    return (
      <div className='page-container'>
        <div className='profile-card'>
          <h2>Loading user data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!editBioMode && (
        <div className='page-container'>
          <div className='profile-card'>
            <div className='profile-icon'>
              <FaRegUserCircle size={'40px'} style={{ color: '#54170a' }} /> {userData?.username}
              {userData?.privacySetting === 'Private' ? <FaLock /> : <FaUnlockAlt />}
            </div>

            {!canEditProfile && (
              <button className='unfollow-btn' onClick={handleUpdateFollowers}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
            {canEditProfile && (
              <>
                <button className='edit-profile-btn' onClick={handleEditProfileClick}>
                  Edit Profile
                </button>
              </>
            )}
            {successMessage && <p className='success-message'>{successMessage}</p>}
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            {userData ? (
              <div className='user-profile'>
                <div className='info-stats-container'>
                  <span className='joined-date'>
                    <i>Joined {new Date(userData.dateJoined).toLocaleDateString()}</i>
                  </span>

                  <div className='stats-and-options'>
                    <div className='stats'>
                      <div role='button'>
                        {userData.postsCreated?.length || 0} <small>Posts</small>
                      </div>
                      <span
                        role='button'
                        onClick={() => {
                          setListType('followers');
                          setShowListPopup(true);
                        }}>
                        {userData.followers?.length || 0} <small>Followers</small>
                      </span>
                      <span
                        role='button'
                        onClick={() => {
                          setListType('following');
                          setShowListPopup(true);
                        }}>
                        {userData.following?.length || 0} <small>Following</small>
                      </span>
                    </div>
                  </div>
                </div>

                <p className='biography'>{userData.biography || 'No biography yet.'}</p>
                <hr className='separator' style={{ marginTop: '30px' }} />
              </div>
            ) : (
              <p className='no-user-data'>
                No user data found. Make sure the username parameter is correct.
              </p>
            )}

            <div className='follow-status-container'>
              <div className='radio-buttons'>
                <input
                  type='radio'
                  name='posts'
                  id='posts'
                  value='posts'
                  checked={selectedOption === 'posts'}
                  onChange={handleRadioChange}
                />
                <label htmlFor='posts'>Posts</label>
                <input
                  type='radio'
                  name='recipes'
                  id='recipes'
                  value='recipes'
                  checked={selectedOption === 'recipes'}
                  onChange={handleRadioChange}
                />
                <label htmlFor='recipes'>Recipes</label>
              </div>
              {showListPopup && listType && (
                <div className='popup-overlay' onClick={() => setShowListPopup(false)}>
                  <div className='popup-content' onClick={e => e.stopPropagation()}>
                    <h3>{listType === 'followers' ? 'Followers' : 'Following'}</h3>
                    {userData && userData[listType] && userData[listType].length > 0 ? (
                      <div>
                        {userData[listType].map((user, index) => (
                          <div
                            key={index}
                            className='list-item-container'
                            onClick={() => {
                              navigate(`/user/${user}`);
                              setShowListPopup(false);
                            }}>
                            {user}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No {listType} yet.</p>
                    )}
                    <button onClick={() => setShowListPopup(false)}>Close</button>
                  </div>
                </div>
              )}

              {selectedOption === 'posts' && (
                <div className='list-container'>
                  {sortedList.length > 0 ? (
                    sortedList.map((sortedItem, index) => {
                      if (isItem(sortedItem)) {
                        return (
                          <div key={index} className='list-item-container'>
                            <span>
                              {' '}
                              <b>
                                {sortedItem.rating}
                                {'.'}
                              </b>{' '}
                              {''}
                              {sortedItem.item}
                              {''} {''} {''} {''}
                              <i> {`---made by @${sortedItem.username}`}</i>
                            </span>
                            {/* Rating Selector */}
                            {sortedItem.rating === 0 ? (
                              <select
                                value={sortedItem.rating}
                                onChange={e =>
                                  handleRatingChange(sortedItem.item, parseInt(e.target.value, 10))
                                }>
                                <option value={0}>Select Ranking</option>
                                {availableRatings.map(rating => (
                                  <option key={rating} value={rating}>
                                    {rating}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span></span> // Display the current rating
                            )}
                            {sortedItem.rating !== 0 && (
                              <button onClick={() => handleRemoveRating(sortedItem.item)}>
                                Remove Rating
                              </button>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <p>No posts yet.</p>
                  )}
                </div>
              )}

              {selectedOption === 'recipes' && (
                <>
                  <div style={{ textAlign: 'center' }}>{/* Recipe Book Section */}</div>
                  <div>
                    {recipesLoading ? (
                      <p>Loading recipes...</p>
                    ) : (
                      <RecipeBook recipes={recipeSaved} />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ---- Edit section ---- */}
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
            privacySetting={privacySetting}
            setPrivacySetting={setPrivacySetting}
            showLists={showLists}
            setShowLists={setShowLists}
            handleUpdatePrivacy={handleUpdatePrivacy}
            handleCheckPrivacy={handleCheckPrivacy}
            isRecipePublic={isRecipePublic}
            toggleRecipeBookVisibility={toggleRecipeBookVisibility}
          />
        )}
      </div>
      {/* {(isRecipePublic || canEditProfile) && (
        <>
          <div style={{ textAlign: 'center' }}>
            <h3>Recipe Book</h3>
          </div>
          <div>{recipesLoading ? <p>Loading recipes...</p> : <RecipeBook recipes={recipes} />}</div>
        </>
      )} */}
    </div>
  );
};

export default ProfileSettings;
