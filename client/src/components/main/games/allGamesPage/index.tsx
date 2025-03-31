import React from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
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
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: 2,
          }}>
          <Typography variant='h6'>Select Game Type</Typography>
          <Button
            fullWidth
            variant='contained'
            onClick={() => handleSelectGameType('Nim')}
            sx={{ mt: 2 }}>
            Nim
          </Button>
          <Button fullWidth variant='outlined' onClick={handleToggleModal} sx={{ mt: 1 }}>
            Cancel
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
