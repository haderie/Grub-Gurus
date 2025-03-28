import { GameMove, GuessTheIngredientState, GuessMove } from '../../types/types';
import Game from './game';

/**
 * Represents a "Guess the Ingredient" game, extending the generic Game class.
 *
 * This class contains the specific game logic for playing "Guess the Ingredient".
 */
class GuessTheIngredientGame extends Game<GuessTheIngredientState, GuessMove> {
  /**
   * Constructor for the GuessTheIngredientGame class, initializes the game state and type.
   */

  public constructor(correctIngredient: string, hints: string[], imageURL: string) {
    super(
      {
        status: 'WAITING_TO_START',
        attempts: { player1: 0, player2: 0 },
        correctIngredient,
        hints,
        imageURL,
        revealed: false,
        score: { player1: 0, player2: 0 },
      },
      'Guess',
    );
  }

  /**
   * Validates the player's guess.
   * @param gameMove The move to validate, including the player ID and the guessed ingredient.
   * @throws Will throw an error if the move is invalid.
   */
  private _validateMove(gameMove: GameMove<GuessMove>): void {
    if (this.state.status !== 'IN_PROGRESS') {
      throw new Error('Invalid move: game is not in progress');
    }
    if (gameMove.playerID !== this.state.currentPlayer) {
      throw new Error('It is not your turn!');
    }
  }

  /**
   * Checks if the game has ended based on the player's guess.
   * If the correct ingredient is guessed, the game ends.
   */
  private _gameEndCheck(guess: string, playerID: string): void {
    const playerSlot = this._players[0] === playerID ? 'player1' : 'player2';

    if (guess.toLowerCase() === this.state.correctIngredient.toLowerCase()) {
      this.state = {
        ...this.state,
        status: 'OVER',
        revealed: true,
        score: { ...this.state.score, [playerSlot]: this.state.score[playerSlot] + 10 },
        winners: [playerID],
      };
    } else {
      this.state = {
        ...this.state,
        attempts: { ...this.state.attempts, [playerSlot]: this.state.attempts[playerSlot] + 1 },
        currentPlayer: this._players.find(id => id !== playerID) || playerID,
      };
    }
  }

  /**
   * Applies a guess to the game, validating it and updating the state.
   * @param move The move to apply.
   */
  public applyMove(move: GameMove<GuessMove>): void {
    this._validateMove(move);
    this._gameEndCheck(move.move.guess, move.playerID);
  }

  /**
   * Starts a new round by setting a new correct ingredient and hints.
   * @param correctIngredient The correct ingredient for this round.
   * @param hints A list of hints for the ingredient.
   * @param imageUrl The image URL for the ingredient.
   */
  //   public startNewRound(correctIngredient: string, hints: string[], imageURL: string): void {
  //     this.state = {
  //       status: 'IN_PROGRESS',
  //       attempts: 0,
  //       correctIngredient,
  //       hints,
  //       imageURL,
  //       revealed: false,
  //       score: this.state.score, // Keep the existing score
  //       player: '',
  //     };
  //   }

  /**
   * Joins a player to the game. The game can only be joined if it is waiting to start.
   * @param playerID The ID of the player joining the game.
   * @throws Will throw an error if the player cannot join.
   */
  protected _join(playerID: string): void {
    if (this.state.status !== 'WAITING_TO_START') {
      throw new Error('Cannot join game: already started');
    }

    if (this._players.includes(playerID)) {
      throw new Error('Cannot join game: player already in game');
    }

    if (this.state.player1 === undefined) {
      this.state = { ...this.state, player1: playerID };
      this.state.currentPlayer = playerID;
    } else if (this.state.player2 === undefined) {
      this.state = { ...this.state, player2: playerID };
    }

    if (this.state.player1 !== undefined && this.state.player2 !== undefined) {
      this.state = { ...this.state, status: 'IN_PROGRESS' };
    }
  }

  /**
   * Removes a player from the game, effectively ending the game.
   * @param username The unique username of the player leaving the game.
   */
  protected _leave(username: string): void {
    if (!this._players.includes(username)) {
      throw new Error(`Cannot leave game: player ${username} is not in the game.`);
    }
    this._players = this._players.filter(id => id !== username);
    this.state.status = 'OVER';
    this.state.winners = this._players.length === 1 ? [this._players[0]] : [];
  }
}

export default GuessTheIngredientGame;
