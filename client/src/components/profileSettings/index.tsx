import React, { useEffect, useState } from 'react';
import './index.css';
import { FaRegUserCircle, FaUnlockAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useProfileSettings from '../../hooks/useProfileSettings';
import useUserRecipes from '../../hooks/useUserRecipes';
import RecipeBook from '../main/recipeBook';
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
    handleRatingChange,
    handleRemoveRating,
    availableRankings,
    usedRankings,
    sortedList,
    isItem,
    recipeSaved,
  } = useProfileSettings();
  const { loading: recipesLoading } = useUserRecipes(userData?.username ?? '');
  const navigate = useNavigate();

  const [showListPopup, setShowListPopup] = useState(false);
  const [listType, setListType] = useState<'followers' | 'following' | null>(null);

  const availableRatings = availableRankings.filter(rating => !usedRankings.has(rating));

  const handlePostClick = (postId: string) => {
    navigate(`/explore?post=${postId}`);
  };

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
                <label htmlFor='recipes'>
                  Recipes {isRecipePublic ? <FaUnlockAlt /> : <FaLock />}
                </label>
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
                            <span onClick={() => handlePostClick(sortedItem.item._id.toString())}>
                              {' '}
                              <b>
                                {sortedItem.rating}
                                {'.'}
                              </b>{' '}
                              {''}
                              {sortedItem?.title}
                              {''} {''} {''} {''}
                              <i> {`---made by @${sortedItem.user}`}</i>
                            </span>
                            {/* Rating Selector */}
                            {sortedItem.rating === 0 && canEditProfile && (
                              <select
                                value={sortedItem.rating !== 0 ? sortedItem.rating : ''}
                                onChange={e =>
                                  handleRatingChange(sortedItem.item, parseInt(e.target.value, 10))
                                }>
                                <option value=''>Select Rating</option>
                                {availableRatings.map(rating => (
                                  <option key={rating} value={rating}>
                                    {rating}
                                  </option>
                                ))}
                              </select>
                            )}
                            {sortedItem.rating !== 0 && canEditProfile && (
                              <button
                                onClick={() => handleRemoveRating(sortedItem.item._id.toString())}>
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
                  {isRecipePublic || canEditProfile ? (
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
                  ) : (
                    <p>This user&apos;s recipe book is private</p>
                  )}
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
    </div>
  );
};

export default ProfileSettings;
