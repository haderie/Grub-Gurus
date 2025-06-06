import { useEffect, useState } from 'react';
import { GameInstance, GameMove, GuessMove, GuessTheIngredientState } from '../types/types';
import useUserContext from './useUserContext';
import { updateHighScore } from '../services/userService';

/**
 * Custom hook to manage the state and logic for the "Guess the Ingredient" game page.
 * @param gameInstance The current instance of the game.
 * @returns Functions and state variables for handling user input, submitting guesses, and retrieving hints.
 */
const useGuessTheIngredientPage = (gameInstance: GameInstance<GuessTheIngredientState>) => {
  const { user, socket } = useUserContext();
  const [guess, setGuess] = useState('');
  const [hint, setHint] = useState<string | null>(null);

  const isCurrentPlayer = gameInstance.state.currentPlayer === user.username;

  const getPlayerKey = (username: string): 'player1' | 'player2' =>
    gameInstance.players[0] === username ? 'player1' : 'player2';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value);
  };

  const handleMakeGuess = () => {
    if (!guess.trim() || !isCurrentPlayer) return;

    const playerKey = getPlayerKey(user.username);

    const guessMove: GameMove<GuessMove> = {
      playerID: user.username,
      gameID: gameInstance.gameID,
      move: { guess: guess.trim() },
    };

    socket.emit('makeMove', {
      gameID: gameInstance.gameID,
      move: guessMove,
    });

    if (guess.toLowerCase() === gameInstance.state.correctIngredient.toLowerCase()) {
      // Correct guess
      gameInstance.state.status = 'OVER';
      gameInstance.state.revealed = true;
      gameInstance.state.score[playerKey] = (gameInstance.state.score[playerKey] || 0) + 10;
      gameInstance.state.winners = [user.username];
      // Check if the player's score exceeds their current high score
      const currentScore = gameInstance.state.score[playerKey] || 0;
      const currentHighScore = user.highScore || 0;
      if (currentScore > currentHighScore) {
        // Update the high score if the current score is greater
        updateHighScore(user.username, currentScore * 10);
      }
    } else {
      // Incorrect guess, increment attempts and show hint if available
      gameInstance.state.attempts[playerKey] = (gameInstance.state.attempts[playerKey] || 0) + 1;
      setHint(
        gameInstance.state.hints[gameInstance.state.attempts[playerKey] - 1] || 'No more hints!',
      );
      gameInstance.state.currentPlayer =
        gameInstance.players.find(p => p !== user.username) || user.username;
    }

    setGuess('');
  };

  useEffect(() => {
    const playerKey = gameInstance.players[0] === user.username ? 'player1' : 'player2';

    if (gameInstance.state.status === 'OVER') {
      const currentScore = gameInstance.state.score[playerKey] || 0;
      const currentHighScore = user.highScore || 0;

      if (currentScore > currentHighScore) {
        // Update the high score if the current score is greater
        updateHighScore(user.username, currentScore);
      }
    }
  }, [gameInstance, user.highScore, user.username]);

  return {
    user,
    guess,
    handleMakeGuess,
    handleInputChange,
    hint,
    isCurrentPlayer,
    getPlayerKey,
  };
};

export default useGuessTheIngredientPage;
