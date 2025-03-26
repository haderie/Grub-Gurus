import React from 'react';
import './index.css';
import { Box, Button, Collapse, Paper, Typography } from '@mui/material';
import useDirectMessage from '../../../hooks/useDirectMessage';
import ChatsListCard from './chatsListCard';
import UsersListPage from '../usersListPage';
import MessageCard from '../messageCard';

/**
 * DirectMessage component renders a page for direct messaging between users.
 * It includes a list of users and a chat window to send and receive messages.
 */
const DirectMessage = () => {
  const {
    selectedChat,
    chatToCreate,
    chats,
    newMessage,
    setNewMessage,
    showCreatePanel,
    setShowCreatePanel,
    handleSendMessage,
    handleChatSelect,
    handleUserSelect,
    handleCreateChat,
    error,
  } = useDirectMessage();

  return (
    <>
      <Paper sx={{ padding: 2, marginBottom: 2, color: '#3E3232' }}>
        {/* Toggle Button */}
        <Button
          variant='contained'
          color='primary'
          onClick={() => setShowCreatePanel(prev => !prev)}
          sx={{ marginBottom: 1, color: '#FFF5E4', backgroundColor: ' #6A9C89' }}>
          {showCreatePanel ? 'Hide Create Chat Panel' : 'Start a Chat'}
        </Button>

        {/* Error Message */}
        {error && (
          <Typography variant='body2' color='error' sx={{ marginTop: 1 }}>
            {error}
          </Typography>
        )}

        {/* Collapsible Create Chat Section */}
        <Collapse in={showCreatePanel}>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant='body1'>
              Selected User: <strong>{chatToCreate || 'None'}</strong>
            </Typography>

            {/* Create Chat Button */}
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleCreateChat}
              sx={{ marginTop: 1, color: '#FFF5E4', backgroundColor: ' #6A9C89', border: 'none' }}>
              Create New Chat
            </Button>

            {/* Users List */}
            <UsersListPage handleUserSelect={handleUserSelect} />
          </Box>
        </Collapse>
      </Paper>
      <div className='direct-message-container'>
        <div className='chats-list'>
          {chats.map(chat => (
            <ChatsListCard key={String(chat._id)} chat={chat} handleChatSelect={handleChatSelect} />
          ))}
        </div>
        <div className='chat-container'>
          {selectedChat ? (
            <>
              <h2>Chat Participants: {selectedChat.participants.join(', ')}</h2>
              <div className='chat-messages'>
                {selectedChat.messages.map(message => (
                  <MessageCard key={String(message._id)} message={message} />
                ))}
              </div>
              <div className='message-input'>
                <input
                  className='custom-input'
                  type='text'
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder='Type a message.'
                />
                <button className='custom-button' onClick={handleSendMessage}>
                  SEND
                </button>
              </div>
            </>
          ) : (
            <h2>Select a user to start chatting</h2>
          )}
        </div>
      </div>
    </>
  );
};

export default DirectMessage;
