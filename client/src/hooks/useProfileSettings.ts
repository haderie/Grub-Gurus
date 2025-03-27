import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getUserByUsername,
  deleteUser,
  resetPassword,
  updateBiography,
  followUser,
  updatePrivacy,
  updateRecipeBookPrivacy,
} from '../services/userService';

import { SafeDatabaseUser, SafePopulatedDatabaseUser } from '../types/types';
import useUserContext from './useUserContext';

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
  const [isRecipePublic, setIsRecipePublic] = useState(currentUser.recipeBookPublic);

  const [newBio, setNewBio] = useState('');
  const [privacySetting, setPrivacySetting] = useState<'Public' | 'Private'>(
    currentUser.privacySetting,
  );
  const [showLists, setShowLists] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // For delete-user confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const canEditProfile =
    currentUser.username && userData?.username ? currentUser.username === userData.username : false;

  const [selectedOption, setSelectedOption] = useState<'recipe' | 'posts'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value as 'recipe' | 'posts');
  };

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserByUsername(username);
        setUserData(data);
        setIsFollowing(data.followers.includes(currentUser.username));
      } catch (error) {
        setErrorMessage('Error fetching user profile');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser.username, currentUser.recipeBookPublic]);

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

    const updatedUser = await updateRecipeBookPrivacy(username, !isRecipePublic);

    // Ensure state updates occur sequentially after the API call completes
    await new Promise(resolve => {
      setUserData(updatedUser); // Update the user data
      resolve(null); // Resolve the promise
    });
    setIsRecipePublic(prevState => !prevState);
  };

  /**
   * Validate the password fields before attempting to reset.
   */
  const validatePasswords = () => {
    if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
      setErrorMessage('Please enter and confirm your new password.');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
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
   *
   *
   */
  const handleCheckPrivacy = async () => {
    if (!username) return;
    try {
      const targetUser = await getUserByUsername(username);
      const targetUserFollowers = targetUser.followers;

      if (targetUser.username === currentUser.username) {
        setShowLists(true);
      }

      if (targetUser.privacySetting === 'Public') {
        setShowLists(true);
      }
      if (
        targetUser.privacySetting === 'Private' &&
        targetUserFollowers?.find(name => name === currentUser.username)
      ) {
        setShowLists(true);
      }
      if (
        targetUser.privacySetting === 'Private' &&
        !targetUserFollowers?.find(name => name === currentUser.username)
      ) {
        setShowLists(false);
      }
    } catch (error) {
      setErrorMessage('Failed to check if this user follows the target user.');
      setSuccessMessage(null);
    }
  };

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

  const checkIfFollowing = (uname: string) => {
    if (!username) return false; // Prevent undefined errors
    return userData?.following?.includes(uname);
  };

  /**
   * Handler for updating the privacy setting of the user
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
    showLists,
    setShowLists,
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
    handleCheckPrivacy,
    isFollowing,
    handleUpdatePrivacy,
    isRecipePublic,
    setIsRecipePublic,
    toggleRecipeBookVisibility,
    checkIfFollowing,
  };
};

export default useProfileSettings;
