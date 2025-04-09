import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ObjectId } from 'mongodb';
import {
  getUserByUsername,
  deleteUser,
  resetPassword,
  updateBiography,
  followUser,
  updatePrivacy,
  updateRecipeBookPrivacy,
  updateRanking,
} from '../services/userService';

import {
  PopulatedDatabasePost,
  PopulatedDatabaseRecipe,
  SafePopulatedDatabaseUser,
} from '../types/types';
import useUserContext from './useUserContext';
import useUserRecipes from './useUserRecipes';

type SortedItem = {
  item: PopulatedDatabasePost;
  title: string;
  rating: number;
  user: string;
};

const isItem = (
  obj: SortedItem,
): obj is { item: PopulatedDatabasePost; title: string; rating: number; user: string } =>
  (obj as { item: PopulatedDatabasePost }).item !== undefined;

/**
 * A custom hook to encapsulate all logic/state for the ProfileSettings component.
 */
const useProfileSettings = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();

  // Local state
  const [userData, setUserData] = useState<SafePopulatedDatabaseUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editBioMode, setEditBioMode] = useState(false);
  const [isRecipePublic, setIsRecipePublic] = useState<boolean>(
    userData?.recipeBookPublic ?? false,
  );

  const [newBio, setNewBio] = useState('');
  const [privacySetting, setPrivacySetting] = useState<'Public' | 'Private'>(
    currentUser.privacySetting,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // For delete-user confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const canEditProfile =
    currentUser.username && userData?.username ? currentUser.username === userData.username : false;

  const [selectedOption, setSelectedOption] = useState<'recipes' | 'posts'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'recipes' | 'posts');
  };

  const [userRankings, setUserRankings] = useState<{ [key: string]: number }>({});
  const [availableRankings, setAvailableRankings] = useState<number[]>([]);
  const [usedRankings, setUsedRankings] = useState<Set<number>>(new Set(Object.values({})));
  const availableRatings = availableRankings.filter(rating => !usedRankings.has(rating));
  const { recipes } = useUserRecipes(userData?.username ?? '');

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setUserData(data);
        setIsFollowing(data.followers.includes(currentUser.username));
        setUserRankings(data.rankings);
        setUsedRankings(new Set(Object.values(data.rankings || {})));
        setIsRecipePublic(data.recipeBookPublic);
      } catch (error) {
        setErrorMessage('Error fetching user profile');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser.username]);

  let selectedList: { title: string; post: PopulatedDatabasePost; user: string }[] = [];
  let recipeSaved: PopulatedDatabaseRecipe[] = [];

  switch (selectedOption) {
    case 'recipes': {
      const saved = userData?.postsCreated?.map(post => post.recipe) || [];
      const savedIds = new Set(saved.map(r => r._id.toString()));

      const additional = recipes.filter(
        r => !savedIds.has(r._id.toString()) && r.addedToCalendar === false,
      );

      recipeSaved = [...saved, ...additional];
      break;
    }
    case 'posts': {
      selectedList =
        userData?.postsCreated?.map(p => ({
          title: p?.recipe?.title,
          post: p,
          user: p.username,
        })) || [];
      break;
    }
    default:
      selectedList = [];
      break;
  }

  const sortedList: SortedItem[] =
    selectedOption === 'posts'
      ? selectedList
          .map(({ post, title, user }) => ({
            item: post,
            title,
            user, // Ensure user is included
            rating: userRankings[post._id.toString()] || 0,
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

  const handleRatingChange = async (item: PopulatedDatabasePost, rating: number) => {
    // Ensure the rank is unique
    if (!usedRankings.has(rating) && username) {
      await updateRanking(username, item._id, rating);

      // Re-fetch updated user
      const updatedUser = await getUserByUsername(username);
      setUserRankings(userData?.rankings);
      await new Promise(resolve => {
        setUserData(updatedUser);
        resolve(null);
      });

      setUserRankings(prevRatings => {
        const newRatings = { ...prevRatings, [item._id.toString()]: rating };
        return newRatings;
      });
      setUsedRankings(prevUsed => new Set(prevUsed.add(rating))); // Add the new rating to used ranks
    } else {
      // eslint-disable-next-line no-alert
      alert('This ranking is already taken. Please choose another.');
    }
  };
  const handleRemoveRating = async (id: ObjectId) => {
    const rating = userRankings[id.toString()];
    if (rating !== undefined) {
      // Remove the rating from the used rankings set
      if (!username) return;

      await updateRanking(username, id, 0);
      const updatedUser = await getUserByUsername(username);

      setUserRankings(updatedUser.rankings);
      setUsedRankings(new Set(Object.values(updatedUser.rankings || {})));

      await new Promise(resolve => {
        setUserData(updatedUser);
        resolve(null);
      });
    }
  };
  /**
   * Toggles the visibility of the password fields.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  /**
   * Toggles the visibility of the recipe Book.
   */
  const toggleRecipeBookVisibility = async () => {
    if (!username) return;

    try {
      const updatedUser = await updateRecipeBookPrivacy(username, !isRecipePublic);

      // Ensure state updates occur sequentially after the API call completes
      await new Promise(resolve => {
        setUserData(updatedUser); // Update the user data
        resolve(null); // Resolve the promise
      });
      setIsRecipePublic(prevState => !prevState);

      setSuccessMessage('Recipe Book privacy updated!');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to update Recipe Book setting.');
      setSuccessMessage(null);
    }
  };

  /**
   * Validate the password fields before attempting to reset.
   */
  const validatePasswords = () => {
    if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
      setErrorMessage('Please enter and confirm your new password.');
      setSuccessMessage(null);
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      setSuccessMessage(null);
      return false;
    }
    return true;
  };

  /**
   * Handler for resetting the password
   */
  const handleResetPassword = async () => {
    if (!username) return;
    if (!validatePasswords()) {
      return;
    }
    try {
      await resetPassword(username, newPassword);
      setSuccessMessage('Password reset successful!');
      setErrorMessage(null);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setErrorMessage('Failed to reset password.');
      setSuccessMessage(null);
    }
  };

  const handleUpdateBiography = async () => {
    if (!username) return;
    try {
      // Await the async call to update the biography
      const updatedUser = await updateBiography(username, newBio);

      // Ensure state updates occur sequentially after the API call completes
      await new Promise(resolve => {
        setUserData(updatedUser); // Update the user data
        // setEditBioMode(false); // Exit edit mode
        resolve(null); // Resolve the promise
      });

      setSuccessMessage('Biography updated!');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to update biography.');
      setSuccessMessage(null);
    }
  };

  /**
   * Handler for deleting the user (triggers confirmation modal)
   */
  const handleDeleteUser = () => {
    if (!username) return;
    setShowConfirmation(true);
    setPendingAction(() => async () => {
      try {
        await deleteUser(username);
        setSuccessMessage(`User "${username}" deleted successfully.`);
        setErrorMessage(null);
        navigate('/');
      } catch (error) {
        setErrorMessage('Failed to delete user.');
        setSuccessMessage(null);
      } finally {
        setShowConfirmation(false);
      }
    });
  };

  /**
   * Function to update the follow status of a user. It toggles the follow/unfollow state
   * and updates the UI accordingly.
   * - If the user successfully follows or unfollows the target user, the follow status is updated.
   * - A success message is shown with the appropriate status (Followed/Unfollowed).
   */
  const handleUpdateFollowers = async () => {
    if (!username) return;
    try {
      const updatedUser = await followUser(currentUser.username, username);
      const followedUser = await getUserByUsername(username);

      setUserData(followedUser);

      if (updatedUser.following?.includes(followedUser.username)) {
        // setUserData(updatedUser);
        setIsFollowing(true);
        setSuccessMessage(`${username} Followed!`);
      } else {
        setIsFollowing(false);
        setSuccessMessage(`${username} Unfollowed :(`);
      }

      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(`Failed to follow/unfollow ${username}.`);
    }
  };

  /**
   * Function to check if the current user is following a specific user.
   * It returns a boolean indicating the follow status.
   *
   * @param uname - The username of the user to check if the current user is following.
   * @returns `true` if the current user is following the provided username, otherwise `false`.
   */
  const checkIfFollowing = (uname: string) => {
    if (!username) return false; // Prevent undefined errors
    return userData?.following?.includes(uname);
  };

  /**
   * Handler for updating the privacy setting of the user's account.
   * This function updates the privacy setting (either 'Public' or 'Private') of the current user.
   * - If the privacy setting is successfully updated, a success message is shown.
   * - If the update fails, an error message is displayed.
   *
   * @param newSetting - The new privacy setting to be applied ('Public' or 'Private').
   */
  const handleUpdatePrivacy = async (newSetting: 'Public' | 'Private') => {
    if (!username) return;
    try {
      setPrivacySetting(newSetting);
      const updatedUser = await updatePrivacy(username, newSetting);
      await new Promise(resolve => {
        setUserData(updatedUser);
        resolve(null);
      });
      setSuccessMessage('Account privacy updated!');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to update privacy setting.');
      setSuccessMessage(null);
    }
  };

  return {
    userData,
    newPassword,
    confirmNewPassword,
    privacySetting,
    setPrivacySetting,
    setNewPassword,
    setConfirmNewPassword,
    loading,
    editBioMode,
    setEditBioMode,
    newBio,
    setNewBio,
    successMessage,
    errorMessage,
    showConfirmation,
    setShowConfirmation,
    pendingAction,
    setPendingAction,
    canEditProfile,
    showPassword,
    selectedOption,
    setSelectedOption,
    togglePasswordVisibility,
    handleRadioChange,
    handleResetPassword,
    handleUpdateBiography,
    handleDeleteUser,
    handleUpdateFollowers,
    isFollowing,
    handleUpdatePrivacy,
    isRecipePublic,
    setIsRecipePublic,
    toggleRecipeBookVisibility,
    checkIfFollowing,
    handleRatingChange,
    handleRemoveRating,
    availableRankings,
    usedRankings,
    userRankings,
    sortedList,
    isItem,
    recipeSaved,
    availableRatings,
  };
};

export default useProfileSettings;
