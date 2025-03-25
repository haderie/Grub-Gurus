import React, { useEffect } from 'react';
import axios from 'axios';
import useUserContext from './useUserContext';
import { DatabaseMessage, Message, MessageUpdatePayload } from '../types/types';
import { addMessage, getMessages } from '../services/messageService';

// Constants for utilizing the Hugging Face AI model
const MODEL_NAME = 'google/gemma-2-2b-it';
// 'flax-community/t5-recipe-generation' <- recipe-specific, less advanced
// google/gemma-2-2b-it <- more advanced model

// /**
//  * A helper function to extract the list of ingredients from the user's message to a list of strings the AI model can use.
//  *
//  * @param message - The message the user provides to the AI model.
//  * @returns The list of ingredients extracted as a list of strings.
//  */
// const extractIngredients = (message: string): string[] => {
// const ingredientsRegex = /(\b\w+\b)(?=,|\.)/g;
//  return message.match(ingredientsRegex) || [];
// };

/**
 * Calls the Hugging Face API to get a response for the given message.
 *
 * @param message - The user's message to send to Hugging Face
 * @returns - The AI-generated response.
 */
const getAIResponse = async (message: string, apiKey: string): Promise<string> => {
  const url = `https://api-inference.huggingface.co/models/${MODEL_NAME}`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const systemPrompt = `You are a master chef and recipe creator, skilled in crafting delicious and creative recipes for any cuisine or dietary preference. 
  Provide clear, step-by-step instructions, including precise ingredient measurements, cooking techniques, and helpful tips. Provide a recipe 
  without asking follow-up questions. Return your answer as properly formatted markdown.`;

  const separator = '\n**Start Recipe:**\n';

  const payload = {
    inputs: `${systemPrompt + message + separator}`,
  };

  try {
    const response = await axios.post(url, payload, { headers });
    const { data } = response;
    return data[0].generated_text.split(separator)[1].trim();
  } catch (err) {
    return 'The Munch Master could not understand your message :(';
  }
};

/**
 * Custom hook that handles the logic for the messaging page.
 *
 * @returns messages - The list of messages.
 * @returns newMessage - The new message to be sent.
 * @returns setNewMessage - The function to set the new message.
 * @returns handleSendMessage - The function to handle sending a new message.
 * @returns aiResponseChecked - The boolean indicating whether the AI response checkbox is checked.
 * @returns setAiResponseChecked - The function to set the state of the AI response checkbox.
 */
const useMessagingPage = () => {
  const { user, socket } = useUserContext();
  const [messages, setMessages] = React.useState<DatabaseMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [aiResponseChecked, setAiResponseChecked] = React.useState<boolean>(false);

  const { REACT_APP_API_KEY: apiKey } = process.env;

  if (apiKey === undefined) {
    throw new Error('apiKey not defined.');
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getMessages();
      setMessages(msgs);
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const handleMessageUpdate = async (data: MessageUpdatePayload) => {
      setMessages([...messages, data.msg]);
    };

    socket.on('messageUpdate', handleMessageUpdate);

    return () => {
      socket.off('messageUpdate', handleMessageUpdate);
    };
  }, [socket, messages]);

  /**
   * Handles sending a new message.
   *
   * @returns void
   */
  const handleSendMessage = async () => {
    if (newMessage === '') {
      setError('Message cannot be empty');
      return;
    }

    setError('');

    const newMsg: Omit<Message, 'type'> = {
      msg: newMessage,
      msgFrom: user.username,
      msgDateTime: new Date(),
    };

    await addMessage(newMsg);

    if (aiResponseChecked) {
      try {
        // For testing purposes, creating a dummy ai message for automatic reply
        const generatedMessage = await getAIResponse(newMsg.msg, apiKey);
        const aiMessage: Omit<Message, 'type'> = {
          msg: generatedMessage,
          msgFrom: 'Munch Master',
          msgDateTime: new Date(),
        };
        await addMessage(aiMessage);
      } catch (err) {
        setError('Failed to generate AI response');
      }
    }

    setNewMessage('');
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    error,
    aiResponseChecked,
    setAiResponseChecked,
  };
};

export default useMessagingPage;
