import React, { useEffect, useState } from 'react';
import './index.css';
import {
  FaRegUserCircle,
  FaUnlockAlt,
  FaLock,
  FaCrown,
  FaHeart,
  FaBook,
  FaHandshake,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import useProfileSettings from '../../hooks/useProfileSettings';
import useUserRecipes from '../../hooks/useUserRecipes';
import RecipeBook from '../main/recipeBook';
import ProfileEdit from './profileEdit';
import { PopulatedDatabasePost, PopulatedDatabaseRecipe } from '../../types/types';
import PostView from '../main/postCard';
import { updateCertifiedStatus } from '../../services/userService';

type SortedItem = {
  item: PopulatedDatabasePost;
  title: string;
  rating: number;
  username: string;
};

const isItem = (
  obj: SortedItem,
): obj is { item: PopulatedDatabasePost; title: string; rating: number; username: string } =>
  (obj as { item: PopulatedDatabasePost }).item !== undefined;

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
  const { loading: recipesLoading } = useUserRecipes(userData?.username ?? '');
  const navigate = useNavigate();

  const [selectedPost, setSelectedPost] = useState<PopulatedDatabasePost | null>(null);
  const [userRankings, setUserRankings] = useState<{ [key: string]: number }>({});
  const [showListPopup, setShowListPopup] = useState(false);
  const [listType, setListType] = useState<'followers' | 'following' | null>(null);

  let isCertified = false;
  let hasHeartBadge = false;
  let hasBookBadge = false;
  let hasSocialBadge = false;

  if (userData) {
    isCertified = userData.certified === true || userData?.postsCreated?.length >= 5;
    if (userData.certified !== true && userData.postsCreated.length >= 5) {
      updateCertifiedStatus(userData.username);
    }
    hasHeartBadge = userData?.postsCreated?.some(post => post.likes.length >= 5);
    hasBookBadge = userData?.postsCreated?.filter(post => post.recipe).length >= 5;
    hasSocialBadge = userData?.following?.length >= 5;
  }

  const [availableRankings, setAvailableRankings] = useState<number[]>([]);
  const [usedRankings, setUsedRankings] = useState<Set<number>>(new Set());
  const availableRatings = availableRankings.filter(rating => !usedRankings.has(rating));

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

  let selectedList: { title: string; post: PopulatedDatabasePost; username: string }[] = [];
  let recipeSaved: PopulatedDatabaseRecipe[] = [];

  switch (selectedOption) {
    case 'recipes':
      recipeSaved = userData?.postsCreated?.map(post => post.recipe) || [];
      break;
    case 'posts':
      selectedList =
        userData?.postsCreated?.map(p => ({
          title: p?.recipe?.title,
          post: p,
          username: p.username,
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
          .map(({ post, title, username }) => ({
            item: post,
            title: post.recipe?.title,
            username, // Ensure user is included
            rating: userRankings[title] || 0,
          }))
          .sort((a, b) => {
            if (a.rating === 0 && b.rating !== 0) return 1; // Push unranked items down
            if (a.rating !== 0 && b.rating === 0) return -1; // Keep ranked items up
            return a.rating - b.rating; // Sort by rating
          })
      : [];
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
                {isCertified && (
                  <p className='certified-user-message'>
                    <FaCrown style={{ color: 'gold', marginRight: '8px' }} /> Certified User
                  </p>
                )}
                <div className='badges-panel'>
                  {' '}
                  <Markdown> **Badges:** </Markdown>
                  {hasHeartBadge && (
                    <div className='badge'>
                      <FaHeart style={{ color: 'red' }} /> Heart badge: Post with 5+ likes!
                    </div>
                  )}
                  {hasBookBadge && (
                    <div className='badge'>
                      <FaBook style={{ color: '#1E90FF' }} /> Book Badge: Saved 5 recipes!
                    </div>
                  )}
                  {hasSocialBadge && (
                    <div className='badge'>
                      <FaHandshake style={{ color: '734F96' }} /> Social Badge: Followed 5 gurus!
                    </div>
                  )}
                  {!hasHeartBadge && !hasBookBadge && !hasSocialBadge && (
                    <div className='no-badge-label'>No badges yet</div>
                  )}
                </div>
                <p className='biography'>{userData.biography || 'No biography yet.'}</p>
                <p className='high-score-display'>High Score: {userData.highScore}</p>
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
                            <span onClick={() => setSelectedPost(sortedItem.item)}>
                              {' '}
                              <b>
                                {sortedItem.rating}
                                {'.'}
                              </b>{' '}
                              {''}
                              {sortedItem?.title}
                              {''} {''} {''} {''}
                              <i> {`---made by @${sortedItem.username}`}</i>
                            </span>
                            {/* Rating Selector */}
                            {sortedItem.rating === 0 && (
                              <select
                                value={sortedItem.rating !== 0 ? sortedItem.rating : ''}
                                onChange={e =>
                                  handleRatingChange(sortedItem.title, parseInt(e.target.value, 10))
                                }>
                                <option value=''>Select Rating</option>
                                {availableRatings.map(rating => (
                                  <option key={rating} value={rating}>
                                    {rating}
                                  </option>
                                ))}
                              </select>
                            )}
                            {sortedItem.rating !== 0 && (
                              <button onClick={() => handleRemoveRating(sortedItem.title)}>
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

              {selectedPost && (
                <div className='popup-overlay-post' onClick={() => setSelectedPost(null)}>
                  <div className='popup-content-post'>
                    <PostView post={selectedPost} />
                    <button onClick={() => setSelectedPost(null)}>Close</button>
                  </div>
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
