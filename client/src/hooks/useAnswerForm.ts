import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { validateHyperlink } from '../tool';
import addAnswer from '../services/answerService';
import useUserContext from './useUserContext';
import { Answer, YouTubeVideo } from '../types/types';

/**
 * Custom hook for managing the state and logic of an answer submission form.
 *
 * @returns text - the current text input for the answer.
 * @returns textErr - the error message related to the text input.
 * @returns setText - the function to update the answer text input.
 * @returns postAnswer - the function to submit the answer after validation.
 */
const useAnswerForm = () => {
  const { qid } = useParams();
  const navigate = useNavigate();

  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [questionID, setQuestionID] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoUrlErr, setVideoUrlErr] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input
  const [videoResults, setVideoResults] = useState<YouTubeVideo[]>([]); // Store video search results
  const [loading, setLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>(''); // Error state for search

  useEffect(() => {
    if (!qid) {
      setTextErr('Question ID is missing.');
      navigate('/home');
      return;
    }

    setQuestionID(qid);
  }, [qid, navigate]);

  /**
   * Validates if the provided URL is a YouTube video URL.
   * @param {string} url - The URL to validate.
   * @returns {boolean} - Returns true if it's a valid YouTube URL, otherwise false.
   * */
  const validateYouTubeURL = (url: string) => {
    const regex =
      /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|e\/|watch\?v%3D)[\w-]+(&[^\s]*)?$/;
    return regex.test(url);
  };

  /**
   * Function to post an answer to a question.
   * It validates the answer text and posts the answer if it is valid.
   */
  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr('Answer text cannot be empty');
      isValid = false;
    }

    if (videoUrl && !validateYouTubeURL(videoUrl)) {
      setVideoUrlErr('Please provide a valid YouTube URL');
      isValid = false;
    } else {
      setVideoUrlErr('');
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer: Answer = {
      text,
      ansBy: user.username,
      ansDateTime: new Date(),
      comments: [],
      youtubeVideoUrl: videoUrl,
      isUserCertified: user.certified,
    };

    const res = await addAnswer(questionID, answer);

    if (res && res._id) {
      // navigate to the question that was answered
      navigate(`/question/${questionID}`);
    }
  };

  /**
   * Search YouTube for videos based on the search term.
   */
  const searchYouTube = useCallback(async () => {
    if (!searchTerm) return;
    setLoading(true);
    setSearchError('');

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: searchTerm,
          key: 'AIzaSyADiL5NSZ4JHnw0dGjhk1ajfzjyl1CI3PQ',
        },
      });
      setVideoResults(response.data.items);
      setLoading(false);
    } catch (err) {
      setSearchError('Error fetching YouTube videos. Please try again.');
      setLoading(false);
    }
  }, [searchTerm]);

  /**
   * Selects a video and saves the video URL.
   * @param {string} videoId - The YouTube video ID.
   */
  const selectVideo = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    setVideoUrl(url);
    setVideoResults([]); // Clear results after selection
  };

  return {
    text,
    textErr,
    setText,
    postAnswer,
    videoUrl,
    setVideoUrl,
    videoUrlErr,
    searchTerm,
    setSearchTerm,
    videoResults,
    setVideoResults,
    searchError,
    searchYouTube,
    selectVideo,
    loading,
  };
};

export default useAnswerForm;
