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

  let selectedList: string[] = [];

  switch (selectedOption) {
    case 'recipe':
      selectedList = userData?.followers || [];
      break;
    case 'posts':
      selectedList = userData?.postsCreated?.map(post => post.recipe.title) || [];
      console.log(selectedList);
      break;
    default:
      selectedList = [];
      break;
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
            {/* ---- Follow / Unfollow button ---- */}
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
                {/* Joined Date + Stats + Selection Buttons */}
                <div className='info-stats-container'>
                  <span className='joined-date'>
                    Joined: <i>{new Date(userData.dateJoined).toLocaleDateString()}</i>
                  </span>

                  <div className='stats-and-options'>
                    {/* Stats Section */}
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

                {/* Biography */}
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

              {(canEditProfile || showLists) && (
                <div className='list-container'>
                  {selectedList && selectedList.length > 0 ? (
                    <div>
                      {selectedList.map((item, index) => (
                        <div key={index} className='list-item-container'>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='no-list-message'>No {selectedOption} yet.</p>
                  )}
                </div>
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
