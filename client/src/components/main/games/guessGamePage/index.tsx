import React from 'react';
import './index.css';
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
    <>
      <div className='guess-rules'>
        <h2>Rules of Guess the Ingredient</h2>
        <p>Try to guess the hidden ingredient before your opponent!</p>
        <ol>
          <li>The game has two players.</li>
          <li>Players take turns guessing the hidden ingredient.</li>
          <li>If you guess incorrectly, you will receive hints.</li>
          <li>The first player to guess correctly wins!</li>
        </ol>
      </div>
      {gameInstance.state.status === 'OVER' && (
        <p>
          <strong>Winner:</strong> {gameInstance.state.winners?.join(', ') || 'No winner'}
          <br />
          <strong>Score:</strong> {`${winnerScore}, ${winnerAttempts} attempt(s)`}
        </p>
      )}
      <div className='guess-game-details'>
        <h2>The Current Kitchen:</h2>
        <p>
          <strong>Chef 1:</strong> {player1}
        </p>
        <p>
          <strong>Chef 2:</strong> {player2}
        </p>
        <p>
          <strong>Who&apos;s Cooking?:</strong> {gameInstance.state.currentPlayer}
        </p>
        <p>
          <strong>Your Attempts:</strong>{' '}
          {gameInstance.state.attempts[getPlayerKey(user.username)] || 0}
        </p>
        <div className='ingredient-image'>
          <div className='ingredient-image'>
            <img
              src={gameInstance.state.imageURL}
              alt='Guess the ingredient'
              style={{
                filter: `blur(10px)`,
                transition: 'filter 0.5s ease-in-out',
              }}
            />
          </div>
        </div>
        {hint && (
          <p>
            <strong>Hint:</strong> {hint}
          </p>
        )}
        {gameInstance.state.status === 'IN_PROGRESS' && isCurrentPlayer && (
          <div className='guess-game-input'>
            <h3>Your Turn! Make a Guess</h3>
            <input
              type='text'
              className='input-guess'
              value={guess}
              onChange={handleInputChange}
              placeholder='Enter your guess'
            />
            <button className='btn-submit' onClick={handleMakeGuess}>
              Submit Guess
            </button>
          </div>
        )}
        {!isCurrentPlayer && gameInstance.state.status === 'IN_PROGRESS' && (
          <p>Waiting for {gameInstance.state.currentPlayer} to guess...</p>
        )}
        {gameInstance.state.status === 'OVER' && (
          <p>
            <strong>Correct Ingredient:</strong> {gameInstance.state.correctIngredient}
          </p>
        )}
      </div>
    </>
  );
};

export default GuessTheIngredientPage;
