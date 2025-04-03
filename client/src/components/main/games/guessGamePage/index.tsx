import React from 'react';
import './index.css';
import { Box, Button, List, ListItem, TextField, Typography } from '@mui/material';
import { GameInstance, GuessTheIngredientState } from '../../../../types/types';
import useGuessTheIngredientPage from '../../../../hooks/useGuessTheIngredientPage';

/**
 * Component to display the "Guess the Ingredient" game page for two players.
 * @param gameInstance The current instance of the game, including player details, game status, and current ingredient.
 * @returns A React component that shows:
 * - The rules of the game.
 * - The current game details, such as players, whose turn it is, scores, and hints.
 * - An input field for making a guess (only for the current player).
 */
const GuessTheIngredientPage = ({
  gameInstance,
}: {
  gameInstance: GameInstance<GuessTheIngredientState>;
}) => {
  const { user, guess, handleMakeGuess, handleInputChange, hint, isCurrentPlayer, getPlayerKey } =
    useGuessTheIngredientPage(gameInstance);

  // Map usernames to player1 and player2
  const player1 = gameInstance.players[0] || 'Waiting for player...';
  const player2 = gameInstance.players[1] || 'Waiting for player...';

  const winner = gameInstance.state.winners?.[0]; // Assumes only one winner

  const winnerScore =
    winner === gameInstance.state.player1
      ? gameInstance.state.score.player1
      : gameInstance.state.score.player2;

  const winnerAttempts =
    winner === gameInstance.state.player1
      ? gameInstance.state.attempts.player1
      : gameInstance.state.attempts.player2;
  return (
    <Box p={3}>
      <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#FFA725' }} gutterBottom>
        Rules:
      </Typography>
      <Typography variant='body1' paragraph>
        The game of Guess the Ingredient is played as follows:
      </Typography>
      <ul>
        <li>The game has two players.</li>
        <li>Players take turns guessing the hidden ingredient.</li>
        <li>If you guess incorrectly, you will receive hints.</li>
        <li>The first player to guess correctly wins!</li>
      </ul>
      <Typography variant='body1' paragraph>
        Try to guess the hidden ingredient before your opponent!
      </Typography>

      <Box mt={3}>
        <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#FFA725' }} gutterBottom>
          Current Kitchen:
        </Typography>
        <Typography variant='body1'>
          <strong>Chef 1:</strong> {player1}
        </Typography>
        <Typography variant='body1'>
          <strong>Chef 2:</strong> {player2}
        </Typography>
        <Typography variant='body1'>
          <strong>Who&apos;s Cooking?:</strong> {gameInstance.state.currentPlayer}
        </Typography>
        <Typography variant='body1'>
          <strong>Your Attempts:</strong>{' '}
          {gameInstance.state.attempts[getPlayerKey(user.username)] || 0}
        </Typography>

        {gameInstance.state.status === 'OVER' && (
          <Typography variant='body1'>
            <strong>Winner:</strong> {gameInstance.state.winners?.join(', ') || 'No winner'}
            <br />
            <strong>Score:</strong> {`${winnerScore}, ${winnerAttempts} attempt(s)`}
          </Typography>
        )}

        <Box mt={3}>
          <Typography
            variant='h6'
            sx={{ mb: 3, fontWeight: 'bold', color: '#FFA725' }}
            gutterBottom>
            Ingredient to Guess:
          </Typography>
          <Box className='ingredient-image'>
            <img
              src={gameInstance.state.imageURL}
              alt='Guess the ingredient'
              style={{
                filter: `blur(10px)`,
                transition: 'filter 0.5s ease-in-out',
                maxWidth: '100%',
              }}
            />
          </Box>

          {hint && (
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>Hint:</strong> {hint}
            </Typography>
          )}

          {gameInstance.state.status === 'IN_PROGRESS' && isCurrentPlayer && (
            <Box mt={3}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#FFA725' }} gutterBottom>
                Your Turn! Make a Guess.
              </Typography>
              <TextField
                type='text'
                value={guess}
                onChange={handleInputChange}
                fullWidth
                sx={{
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
                onClick={handleMakeGuess}
                sx={{ backgroundColor: '#FFA725' }}>
                Submit Guess
              </Button>
            </Box>
          )}

          {!isCurrentPlayer && gameInstance.state.status === 'IN_PROGRESS' && (
            <Typography variant='body1' mt={2}>
              Waiting for {gameInstance.state.currentPlayer} to guess...
            </Typography>
          )}

          {gameInstance.state.status === 'OVER' && (
            <Typography variant='body1' mt={2}>
              <strong>Correct Ingredient:</strong> {gameInstance.state.correctIngredient}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GuessTheIngredientPage;
