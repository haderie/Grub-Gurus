import React, { useEffect } from 'react';
import useUserContext from './useUserContext';
import { DatabaseMessage, Message, MessageUpdatePayload } from '../types/types';
import { addMessage, getMessages } from '../services/messageService';
import getAIResponse from '../tool/aiInteraction';

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
