import { GameMove, GuessMove } from '@fake-stack-overflow/shared';
import GuessTheIngredientGame from '../../../services/games/guess';

describe('GuessTheIngredientGame', () => {
  let guessGame: GuessTheIngredientGame;

  const correctIngredient = 'Tomato';
  const hints = ['Red', 'Used in pasta sauce', 'A fruit'];
  const imageURL = 'http://example.com/image.jpg';
  const player1 = 'player1';
  const player2 = 'player2';

  beforeEach(() => {
    guessGame = new GuessTheIngredientGame(correctIngredient, hints, imageURL);
  });

  test('initializes correctly', () => {
    expect(guessGame.state.status).toBe('WAITING_TO_START');
    expect(guessGame.state.correctIngredient).toBe(correctIngredient);
    expect(guessGame.state.hints).toEqual(hints);
    expect(guessGame.state.imageURL).toBe(imageURL);
    expect(guessGame.state.revealed).toBe(false);
  });

  test('players can join the game', () => {
    guessGame.join(player1);
    expect(guessGame.state.player1).toBe(player1);
    expect(guessGame.state.status).toBe('WAITING_TO_START');

    guessGame.join(player2);
    expect(guessGame.state.player2).toBe(player2);
    expect(guessGame.state.status).toBe('IN_PROGRESS');
  });

  test('prevents joining an already started game', () => {
    guessGame.join(player1);
    guessGame.join(player2);
    expect(() => guessGame.join('player3')).toThrow('Cannot join game: already started');
  });

  test('validates moves correctly', () => {
    guessGame.join(player1);
    guessGame.join(player2);

    const invalidMove: GameMove<GuessMove> = {
      gameID: 'testGameID',
      playerID: 'randomPlayer',
      move: { guess: 'Onion' },
    };
    expect(() => guessGame.applyMove(invalidMove)).toThrow('It is not your turn!');
  });

  test('players take turns and game progresses', () => {
    guessGame.join(player1);
    guessGame.join(player2);

    expect(guessGame.state.currentPlayer).toBe(player1);

    const move1: GameMove<GuessMove> = {
      gameID: 'testGameID',
      playerID: player1,
      move: { guess: 'Onion' },
    };
    guessGame.applyMove(move1);
    expect(guessGame.state.currentPlayer).toBe(player2);
  });

  test('correct guess ends the game', () => {
    guessGame.join(player1);
    guessGame.join(player2);

    const winningMove: GameMove<GuessMove> = {
      gameID: 'testGameID',
      playerID: player1,
      move: { guess: 'Tomato' },
    };
    guessGame.applyMove(winningMove);
    expect(guessGame.state.status).toBe('OVER');
    expect(guessGame.state.revealed).toBe(true);
    expect(guessGame.state.winners).toContain(player1);
  });

  test('incorrect guesses increase attempts', () => {
    guessGame.join(player1);
    guessGame.join(player2);

    const move1: GameMove<GuessMove> = {
      gameID: 'testGameID',
      playerID: player1,
      move: { guess: 'Onion' },
    };
    guessGame.applyMove(move1);
    expect(guessGame.state.attempts.player1).toBe(1);

    const move2: GameMove<GuessMove> = {
      gameID: 'testGameID',
      playerID: player2,
      move: { guess: 'Carrot' },
    };
    guessGame.applyMove(move2);
    expect(guessGame.state.attempts.player2).toBe(1);
  });

  test('player leaving ends the game', () => {
    guessGame.join(player1);
    guessGame.join(player2);
    guessGame.leave(player1);
    expect(guessGame.state.status).toBe('OVER');
  });
});
