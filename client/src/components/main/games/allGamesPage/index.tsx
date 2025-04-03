import React from 'react';
import { Box, Button, Typography, Modal, IconButton } from '@mui/material';
import { MdClose } from 'react-icons/md';
import useAllGamesPage from '../../../../hooks/useAllGamesPage';
import GameCard from './gameCard';

const AllGamesPage = () => {
  const {
    availableGames,
    handleJoin,
    fetchGames,
    isModalOpen,
    handleToggleModal,
    handleSelectGameType,
    error,
  } = useAllGamesPage();

  return (
    <Box p={3}>
      <Typography variant='h5' fontWeight='bold'>
        Available Games
      </Typography>

      <Button
        variant='contained'
        color='primary'
        onClick={handleToggleModal}
        sx={{ mt: 2, backgroundColor: '#6A9C89', color: '#FFF5E4' }}>
        Create Game
      </Button>

      <Modal open={isModalOpen} onClose={handleToggleModal}>
        <Box
          p={3}
          sx={{
            position: 'relative', // Add relative positioning to allow positioning the close icon
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: 2,
            width: '400px', // Limit the width of the modal
            maxWidth: '60vw', // Ensure it doesn't exceed 90% of the viewport width
            maxHeight: '80vh', // Limit the modal height
            overflowY: 'auto', // Ensure the content is scrollable if needed
          }}>
          {/* Close Icon */}
          <IconButton
            onClick={handleToggleModal}
            sx={{
              'position': 'absolute',
              'top': '10px',
              'right': '10px',
              'color': '#888',
              '&:hover': {
                color: '#000', // Change color on hover
              },
            }}>
            <MdClose size={24} /> {/* React Icon with size prop */}
          </IconButton>

          <Typography variant='h6' textAlign={'center'}>
            Select Game Type
          </Typography>

          <Button
            fullWidth
            variant='contained'
            onClick={() => handleSelectGameType('Nim')}
            sx={{ mt: 2, backgroundColor: '#6A9C89', color: '#FFF5E4' }}>
            The Last Bite
          </Button>
          <Button
            fullWidth
            variant='contained'
            onClick={() => handleSelectGameType('Guess')}
            sx={{ mt: 2, backgroundColor: '#FFA725', color: '#FFF5E4' }}>
            Guess the Ingredient
          </Button>
        </Box>
      </Modal>

      {error && <Typography color='error'>{error}</Typography>}

      <Button
        variant='contained'
        color='primary'
        onClick={fetchGames}
        sx={{ mt: 2, ml: 3, backgroundColor: '#FFA725', color: '#FFF5E4' }}>
        Refresh List
      </Button>

      <Box mt={2}>
        {availableGames.map(game => (
          <GameCard key={game.gameID} game={game} handleJoin={handleJoin} />
        ))}
      </Box>
    </Box>
  );
};

export default AllGamesPage;
