import React from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { GameInstance, NimGameState } from '../../../../types/types';
import useNimGamePage from '../../../../hooks/useNimGamePage';

/**
 * Component to display the "Nim" game page, including the rules, game details, and functionality to make a move.
 * @param gameInstance The current instance of the Nim game, including player details, game status, and remaining objects.
 * @returns A React component that shows:
 * - The rules of the Nim game.
 * - The current game details, such as players, current turn, remaining objects, and winner (if the game is over).
 * - An input field for making a move (if the game is in progress) and a submit button to finalize the move.
 */
const NimGamePage = ({ gameInstance }: { gameInstance: GameInstance<NimGameState> }) => {
  const { user, move, handleMakeMove, handleInputChange } = useNimGamePage(gameInstance);

  return (
    <Box p={3}>
      <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#FFA725' }} gutterBottom>
        Rules:
      </Typography>
      <Typography variant='body1' paragraph>
        The game of The Last Bite is played as follows:
      </Typography>
      <ul>
        <li>The game starts with a plate of food.</li>
        <li>Players take turns taking bites from the plate.</li>
        <li>On their turn, a player must take 1, 2, or 3 bites from the plate.</li>
        <li>The player who takes the last bite loses the game.</li>
      </ul>
      <Typography variant='body1' paragraph>
        Think strategically and try to force your opponent into a losing position!
      </Typography>

      <Box mt={3}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#FFA725' }} gutterBottom>
          Current Plate:
        </Typography>
        <Typography variant='body1'>
          <strong>Player 1:</strong> {gameInstance.state.player1 || 'Waiting...'}
        </Typography>
        <Typography variant='body1'>
          <strong>Player 2:</strong> {gameInstance.state.player2 || 'Waiting...'}
        </Typography>
        <Typography variant='body1'>
          <strong>Current Player to Move:</strong>{' '}
          {gameInstance.players[gameInstance.state.moves.length % 2]}
        </Typography>
        <Typography variant='body1'>
          <strong>Remaining Bites:</strong> {gameInstance.state.remainingObjects}
        </Typography>
        {gameInstance.state.status === 'OVER' && (
          <Typography variant='body1'>
            <strong>Winner:</strong> {gameInstance.state.winners?.join(', ') || 'No winner'}
          </Typography>
        )}

        {gameInstance.state.status === 'IN_PROGRESS' && (
          <Box mt={3}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#FFA725' }} gutterBottom>
              Take Your Bite:
            </Typography>
            <TextField
              label='Enter number from 1-3'
              type='number'
              value={move}
              onChange={handleInputChange}
              inputProps={{ min: 1, max: 3 }}
              fullWidth
              sx={{
                'maxWidth': 200,
                'marginBottom': 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#6A9C89', // Set custom border color on focus
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6A9C89', // Set custom label color on focus
                },
              }}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={handleMakeMove}
              sx={{ backgroundColor: '#FFA725', marginLeft: 2 }}
              disabled={
                gameInstance.players[gameInstance.state.moves.length % 2] !== user.username
              }>
              Submit Move
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NimGamePage;
