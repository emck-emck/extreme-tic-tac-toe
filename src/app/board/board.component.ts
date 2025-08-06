/**
 * The main controller for the gameplay itself.
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class Board {
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

	// This variable is a memory holder for the board state so that win conditions can be checked.
	boardState: number[][];
	tttWins: number[];

	gameTurn: number;
	activeBoard: number;

	@Input() computerPlayer: number;
	@Output() headerMsg = new EventEmitter();

	tttBoardsInit: number[];

	/**
	 * CONSTRUCTOR
	 * Board initialization goes here
	 */
	constructor() {
		this.gameTurn = 0;
		this.tttBoardsInit = [0, 1, 2];
		this.activeBoard = -1;

		// Initialize board state
		this.boardState = new Array(9);
		this.tttWins = new Array(9);
		for (var i: number = 0; i < 9; i++) {
			this.boardState[i] = new Array(9);
			this.tttWins[i] = 0;
			for (var j: number = 0; j < 9; j++) {
				this.boardState[i][j] = 0;
			}
		}
	}

	/**
	 * Main action listener function
	 * Pretty much the entry point to any code run in this component
	 */
	handleSquareClick(ids: Event) {
		var obj: JSON = JSON.parse(String(ids));
		var headerMsg: string;
		var stateFlag: number = 1;

		stateFlag = this.saveBoardChange(obj, stateFlag);
		stateFlag = this.changeActiveBoard(obj['id'], stateFlag);

		this.gameTurn++;
		headerMsg = this.getHeaderMessage(obj['p'], stateFlag);
		this.headerMsg.emit(headerMsg);

		if (stateFlag == 4) {
			this.handleEndGame();
		} else {
			if (this.computerPlayer != 0) {
				this.handleComputerPlay();
			}
		}
	}

	/**
	 * SAVEBOARDCHANGE() and associated functions
	 */
	// Save square clicked to boardState object and check for board win condition
	// Returns a flag for board state
	saveBoardChange(obj: JSON, stateFlag: number): number {
		var flag: number = stateFlag; // Flag one is a regular state
		var isBoardWin: boolean;
		this.boardState[obj['qid']][obj['id']] = obj['p'];
		isBoardWin = this.checkTTTWinCondition(obj['qid'], obj['p']);
		if (isBoardWin) {
			// Flag 2 means a board was won
			flag = 2;
			// change CSS on given TTT to reflect player win
			// Save board win in memory
			this.tttWins[obj['qid']] = obj['p'];
			// check for game win
			var isGameWin: boolean = this.checkGameWinCondition(obj['p']);
			if (isGameWin) {
				flag = 4; // Flag 4 means a player won the game
			}
		}
		return flag;
	}

	// Checks to see if one of the quadrants was won with the last move.
	checkTTTWinCondition(qid: number, p: number): boolean {
		var isWin: boolean;

		// If the board was already won, return false; it can't be re-won.
		if (this.tttWins[qid] != 0) {
			return false;
		}
		// For each possible win condition:
		for (var i: number = 0; i < this.winConditions.length; i++) {
			isWin = true;
			// We check if the win condition was met
			for (var j: number = 0; j < this.winConditions[i].length; j++) {
				// This boolean in other words means:
				// does the concerned quadrant have our player's token in a win condition spot
				if (!(this.boardState[qid][this.winConditions[i][j]] == p)) {
					// If they don't, it's not a win.
					isWin = false;
				}
			}
			// If a win condition is met then it's a win
			if (isWin) {
				return true;
			}
		}
	}

	// Same logic as checkTTTWinCondition, just for the big board instead of the little one
	checkGameWinCondition(p: number) {
		var isWin: boolean;
		// For each win condition:
		for (var i: number = 0; i < this.winConditions.length; i++) {
			isWin = true;
			// Check if win condition is met
			for (var j: number = 0; j < this.winConditions[i].length; j++) {
				// Translation:
				// does the player have a win on a specific board
				if (!(this.tttWins[this.winConditions[i][j]] == p)) {
				isWin = false;
				}
			}
			if (isWin) {
				break;
			}
		}
		return isWin;
	}

	/**
	 * CHANGEACTIVEBOARD() and associated functions
	 */
	// This method changes the active TTT board to the one corresponding to where the user clicked on the previously active one.
	// checkHungBoard() handles the selection logic.
	changeActiveBoard(squareClicked: number, stateFlag: number): number {
		var flag: number = stateFlag;
		this.activeBoard = this.checkHungBoard(squareClicked);

		// If the new active board isn't where the user specified, we know it was hung
		if (this.activeBoard != squareClicked) {
			flag = 3; // flag 3 means the board was hung
		}

		if (this.activeBoard == -1) {
			flag = 5; // Flag 5 means the entire game board is full
		}
		return flag;
	}

	// This checks to see if the board that is being navigated to has any squares available to be clicked on.
	checkHungBoard(squareClicked: number) {
		// This is to see if we can get to the intended board
		for (var i: number = 0; i < this.boardState[squareClicked].length; i++) {
			if (this.boardState[squareClicked][i] == 0) {
				return squareClicked;
			}
		}

		// If we made it this far then the intended board is full. Find an empty one.
		return this.findUnhung();
	}

	// Locates a board with available squares to continue the game
	// Selection happens in order of left-to-right, top-to-bottom
	findUnhung() {
		for (var i: number = 0; i < this.boardState.length; i++) {
			for (var j: number = 0; j < this.boardState[i].length; j++) {
				if (this.boardState[i][j] == 0) {
					return i;
				}
			}
		}
		// This means the whole board is full
		return -1;
	}

	/**
	 * GETHEADERMESSAGE() and associated functions
	 */
	getHeaderMessage(lastPlayer: number, flag: number): string {
		var msg: string;
		if (flag == 1) {
			// Flag 1 means the player made a move.
			if (lastPlayer == 1) {
				msg = "Player 2's turn";
			} else {
				msg = "Player 1's turn";
			}
		} else if (flag == 2) {
			// Flag 2 means a player won a board
			if (lastPlayer == 1) {
				msg = "Board won by Player 1. Player 2's turn";
			} else {
				msg = "Board won by Player 2. Player 1's turn";
			}
		} else if (flag == 3) {
			// Flag 3 means a hung board was encountered
			if (lastPlayer == 1) {
				msg = "Board hung, new board selected. Player 2's turn";
			} else {
				msg = "Board hung, new board selected. Player 1's turn";
			}
		} else if (flag == 4) {
			// Flag 4 means the game is over and someone won
			if (lastPlayer == 1) {
				msg = 'Game over, Player 1 wins!';
			} else {
				msg = 'Game over, Player 2 wins!';
			}
		} else if (flag == 5) {
			msg = "Game board is full, it's a cat's game";
		} else {
			msg = 'Something went wrong';
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
	 * HANDLECOMPUTERPLAY() and associated functions
	 */
	handleComputerPlay() {
		var cJSON: JSON = JSON.parse('{}');
		var cMove: number;
		var headerMsg: string;
		var stateFlag: number = 1;

		if(this.computerPlayer == 1){
			cMove = this.computerMove(this.boardState[this.activeBoard]);
		}else if(this.computerPlayer == 2){ 
			cMove = this.level2ComputerMove(this.boardState[this.activeBoard]);
		}

		// Manually create computer JSON
		cJSON['id'] = cMove;
		cJSON['qid'] = this.activeBoard;
		cJSON['p'] = 2;

		stateFlag = this.saveBoardChange(cJSON, stateFlag);
		stateFlag = this.changeActiveBoard(cMove, stateFlag);

		this.gameTurn++;
		headerMsg = this.getHeaderMessage(cJSON['p'], stateFlag);
		this.headerMsg.emit(headerMsg);

		if (stateFlag == 4) {
			this.handleEndGame();
		}
	}

	level2ComputerMove(ttt: number[]): number {
		var ans: number;

		// Check if board has already been won
		console.log(this.tttWins[this.activeBoard]);
		if(this.tttWins[this.activeBoard] != 0){
			// If board has already been won play randomly
			return this.computerMove(ttt);
		}

		// Check for immediate wins
		ans = this.l2cw(ttt, 2);
		console.log(ans);
		if(ans != 0) return ans;

		// Check for immediate losses
		ans = this.l2cw(ttt, 1);
		console.log(ans);
		if(ans != 0) return ans;

		// Play advantageous square if none of the above found
		ans = this.l2as(ttt);
		console.log(ans);
		return ans;
	}

	// Level 2 Check Wins (/Losses)
	l2cw(ttt: number[], p: number): number{
		for (var i: number = 0; i < this.winConditions.length; i++) { // For each potential win condition:
			var r: number = 0; // How many in a row have we found for this win condition?
			for(var j: number = 0; j < this.winConditions[i].length; j++){
				if(ttt[this.winConditions[i][j]] == p){ // Is there a player X or O in this win condition square?
					r = r + 1;
				}
			}
			if(r == 2){ // If there's two in a row within a win condition
				// Find the third square
				for(var j: number = 0; j < this.winConditions[i].length; j++){
					if(ttt[this.winConditions[i][j]] == 0){ // Is the third square blank?
						return this.winConditions[i][j]; // Fill in this third square
					}
				}
			}
		}
		return 0;
	}

	// Level 2 Advantageous Square
	l2as(ttt: number[]): number{
		var rando: number;
		const priority: number[][] = [[4], [0, 2, 6, 8], [1, 3, 5, 7]]; //Squares listed in order of how inherently good they are
		for(var i: number = 0; i < priority.length; i++){ //For each priority level
			var temp: number[] = [];
			for(var j: number = 0; j < priority[i].length; j++){ 
				if(ttt[priority[i][j]] == 0){
					temp.push(priority[i][j]); // Push every free square of that priority level into a temp array
				}
			}
			if(temp.length > 0){
				rando = Math.floor(Math.random()*temp.length); // Pick a random free square
				return temp[rando];
			}
		}
		return -1;
	}
	
	computerMove(ttt: number[]): number {
		var rando: number;
		// We have made sure that there's a square for the computer to play in
		while (true) {
			rando = Math.floor(Math.random() * 9);
			if (ttt[rando] == 0) {
				return rando;
			}
		}
	}

}