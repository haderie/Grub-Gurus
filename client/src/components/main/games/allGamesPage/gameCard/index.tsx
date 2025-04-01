import React from 'react';
import './index.css';
import { Card, CardContent, Typography, List, ListItem, Button } from '@mui/material';
import { GameInstance, WinnableGameState } from '../../../../../types/types';

/**
 * Component to display a game card with details about a specific game instance.
 * @param game The game instance to display.
 * @param handleJoin Function to handle joining the game. Takes the game ID as an argument.
 * @returns A React component rendering the game details and a join button if the game is waiting to start.
 */
const GameCard = ({
  game,
  handleJoin,
}: {
  game: GameInstance<WinnableGameState>;
  handleJoin: (gameID: string) => void;
}) => (
  <Card sx={{ width: '100%', marginBottom: '20px', boxShadow: 3 }}>
    <CardContent>
      <Typography variant='h6' component='div'>
        <strong>{game.gameType === 'Nim' ? 'Nim' : 'Guess The Ingredient'}</strong>
        <br />
        <br />
        <strong> Game ID: </strong> {game.gameID}
        <br />
      </Typography>
      <strong>Status:</strong> {game.state.status}
      {game.state.status === 'OVER' && (
        <Typography variant='body1' component='p'>
          <strong>Winner:</strong> {game.state.winners!.join(', ') || 'No winner'}
        </Typography>
      )}
      <List>
        {game.players.map((player: string) => (
          <ListItem
            key={`${game.gameID}-${player}`}
            sx={{
              backgroundColor: '#FFF5E4',
              marginBottom: '8px', // Spacing between list items
              borderRadius: '8px', // Rounded corners
              padding: '10px',
            }}>
            <Typography variant='body2' sx={{ fontSize: '18px' }}>
              {player}
            </Typography>
          </ListItem>
        ))}
      </List>
      {game.state.status === 'WAITING_TO_START' && (
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleJoin(game.gameID)}
          sx={{ mt: 2, backgroundColor: '#6A9C89' }}>
          Join Game
        </Button>
      )}
    </CardContent>
  </Card>
);

export default GameCard;
