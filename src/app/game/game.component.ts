import { Component, EventEmitter, Output, Input } from '@angular/core';
import { GameCommObj } from '../game-comm-obj.interface';
import { ComputerService } from '../computer/computer.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @Input() computerPlayer!: number;
  @Output() mainMenuEmitter = new EventEmitter();

  // This variable defines what "three in a row" looks like in terms of a one-dimensional array
  private winConditions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  boardState: number[][]; // Holds each square state in memory
  qWins: number[]; // Tracks quadrant wins
  activeBoard: number; // Tracks what board is active
  gameTurn: number; // Tracks turn count
  headerMsg: string; // String that displays on header

  computer: ComputerService; // Connection to ComputerService

  constructor() {
    this.headerMsg = "Player 1's turn. Click any square to start.";
    this.activeBoard = -1;
    this.gameTurn = 0;

    // Initialize board state
    this.boardState = new Array(9);
    this.qWins = new Array(9);
    for (var i: number = 0; i < 9; i++) {
      this.boardState[i] = new Array(9);
      this.qWins[i] = 0;
      for (var j: number = 0; j < 9; j++) {
        this.boardState[i][j] = 0;
      }
    }

    // Initialize Computer
    this.computer = new ComputerService();
	this.computer.difficulty = this.computerPlayer;
  }

  ngOnInit(){
    this.computer.difficulty = this.computerPlayer;
  }

  /**
   * Main action listener function
   * Pretty much the entry point to any code run in this component
   */
  handleSquareClick(ids: Event) {
    var obj: GameCommObj = JSON.parse(String(ids));
    var stateFlag: number;

    stateFlag = this.saveBoardChange(obj);
    if(stateFlag != 4){ // If state is 4, game is won.
      stateFlag = this.changeActiveBoard(obj['sid'], stateFlag);
    }
    
    this.headerMsg = this.getHeaderMessage(stateFlag);

    if (stateFlag == 4) {
      this.handleEndGame();
    } else {
      this.gameTurn++;
      this.handleComputerPlay();
    }
  }

  /**
   * SAVEBOARDCHANGE() and associated functions
   */
  // Save square clicked to boardState object and check for board win condition
  // Returns a flag for board state
  saveBoardChange(obj: GameCommObj): number {
    var flag: number = 1;
    var isBoardWin: boolean = false;
    var s = obj['sid'];
    var q = obj['qid'];
    var pid = obj['pid'];

    this.boardState[q][s] = pid; // THE BOARD CHANGE SAVE

    // Boards can only be won once, cancel check if already won
    if(this.qWins[q] == 0){
      isBoardWin = this.checkWinCondition(pid, this.boardState[q]);;
    }
    if (isBoardWin) {
      // Flag 2 means a board was won
      flag = 2;
      // change CSS on given quadrant to reflect player win
      this.qWins[q] = pid; // Save board win in memory
      // check for game win
      var isGameWin: boolean = this.checkWinCondition(pid, this.qWins);
      if (isGameWin) {
        flag = 4; // Flag 4 means a player won the game
      }
    }else{
      // Check for cat's game on un-won board and save it if found
      if(this.qWins[q] == 0 && this.checkCatsGame(this.boardState[q])){
        this.qWins[q] = -1;
      }
    }
    return flag;
  }

  // Checks if a three-by-three grid has a win in it
  checkWinCondition(pid: number, board: number[]): boolean{
    var isWin: boolean = false;
    // For each win condition:
    for (var i: number = 0; i < this.winConditions.length; i++) {
      isWin = true;
      // Check if win condition is met
      for (var j: number = 0; j < this.winConditions[i].length; j++) {
        // Translation:
        // does the player have a win on a specific board
        if (!(board[this.winConditions[i][j]] == pid)) {
          isWin = false;
        }
      }
      if (isWin) {
        break;
      }
    }
    return isWin;
  }

  // Checks for a cat's game in any given quadrant
  checkCatsGame(board: number[]){
    // Check if any squares are empty
    // (We verified in saveBoardChange that the board was never won)
    for(var i: number = 0; i < board.length; i++){
      if(board[i] == 0){
        return false; // not a cat's game if there's still a square
      }
    }
    return true; 
  }


  /**
   * CHANGEACTIVEBOARD() and associated functions
   */
  // this.activeBoard tracks where the opponent has to play
  changeActiveBoard(squareClicked: number, stateFlag: number): number {
    var flag: number = stateFlag;

    if(this.qWins[squareClicked] == 0){
      this.activeBoard = squareClicked;
    }else{ // If a player already won the destination board, the opponent may play in any board
      this.activeBoard = -1;
      flag = 3;
    }

    return flag;
  }

  
  /**
   * GETHEADERMESSAGE() and associated functions
   */
  getHeaderMessage(flag: number): string {
    var msg: string;
    var p: string = (this.gameTurn % 2 == 0)? "1" : "2";
    var o: string = (this.gameTurn % 2 == 0)? "2" : "1";

      switch(flag){
        case 1: // Flag 1 means the player played a move and nothing special happened
          msg = `Player ${o}'s turn`;
          break;
        case 2: // Flag 2 means the player won a quadrant
          msg = `Board won by Player ${p}. Player ${o}'s turn`;
          break;
        case 3: // Flag 3 means the board the opponent was sent to was already won
          msg = `Hung board. Player ${o}'s turn; can play in any quadrant`;
          break;
        case 4: // Flag 4 means the player won the game
          msg = `Game over, player ${p} wins!`;
          break;
        case 5: // Flag 5 means that the game is over with no winner
          msg = "Game board is full, it's a cat's game";
          break;
        default: // Any other flag should be impossible
          msg = "Something went wrong";
      }

    return msg;
  }

  /**
   * HANDLEENDGAME() and associated functions
   */
  handleEndGame() {
    this.activeBoard = 9;
  }


  /**
   * HANDLECOMPUTERPLAY and associated functions
   */
  handleComputerPlay() {
    var cIn: GameCommObj;
    var cOut: GameCommObj = JSON.parse('{}');
    var cMove: number;
    var cBoard: number;
    var headerMsg: string;
    var stateFlag: number = 1;

	if (this.computer.difficulty == 0){
		return;
	}
    
    if(this.activeBoard == -1){
      cIn = this.computer.computerMoveBoard(this.qWins, this.boardState);
    }else{
      cIn = this.computer.computerMove(this.boardState[this.activeBoard], this.activeBoard);
    }

    // Manually create computer JSON
    cOut['qid'] = cIn['qid'];
    cOut['sid'] = cIn['sid'];
    cOut['pid'] = 2;

    stateFlag = this.saveBoardChange(cOut);
    stateFlag = this.changeActiveBoard(cOut['sid'], stateFlag);

    this.headerMsg = this.getHeaderMessage(stateFlag);
    
    if (stateFlag == 4) {
      this.handleEndGame();
    }else{
      this.gameTurn++;
    }
  }


  handleMainMenu() {
    this.mainMenuEmitter.emit();
  }

}