import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import NimGamePage from '../nimGamePage';
import useGamePage from '../../../../hooks/useGamePage';
import { GameInstance, NimGameState } from '../../../../types/types';

const GamePage = () => {
  const { gameInstance, error, handleLeaveGame } = useGamePage();

  const renderGameComponent = (gameType: string) => {
    if (!gameInstance) return null;

    switch (gameType) {
      case 'Nim':
        return <NimGamePage gameInstance={gameInstance as GameInstance<NimGameState>} />;
      default:
        return (
          <Typography variant='body1' color='error'>
            Unknown game type
          </Typography>
        );
    }
  };

  return (
    <Box p={3} display='flex' flexDirection='column' alignItems='center'>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, p: 3, textAlign: 'center' }}>
        <Typography variant='h4' fontWeight='bold' color='#6A9C89'>
          The Last Bite
        </Typography>
        <Typography variant='subtitle1' sx={{ mt: 1 }}>
          Status: {gameInstance ? gameInstance.state.status : 'Not started'}
        </Typography>

        <Button
          variant='contained'
          onClick={handleLeaveGame}
          sx={{
            'mt': 2,
            'backgroundColor': '#FFA725',
            'color': '#FFF5E4',
            '&:hover': { backgroundColor: '#E69520' },
          }}>
          Leave Game
        </Button>
      </Paper>

      <Box mt={3} width='100%' display='flex' justifyContent='center'>
        {gameInstance && renderGameComponent(gameInstance.gameType)}
      </Box>

      {error && (
        <Typography variant='body1' color='error' sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default GamePage;
