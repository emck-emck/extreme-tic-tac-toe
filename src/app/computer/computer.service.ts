import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  difficulty: number;

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

  constructor(d) {
    this.difficulty = d;
  }

  public computerSelectBoard(boardState: number[]): number{
    var select: number[] = [];
    var rando: number;
    if(this.difficulty == 1){
    for(var i: number = 0; i < boardState.length; i++){
      if(boardState[i] == 0){
        select.push(i);
      }
    }
    rando = Math.floor(Math.random() * select.length)
	return select[rando];
	}else if(this.difficulty == 2){
	  return -1;
	}else{
	  return -1;
	}
    
  }

  // We have made sure that there's a square for the computer to play in
  public computerMove(ttt: number[]): number {
    var ans: number;
	if(this.difficulty == 1){ // Level one plays random squares
      while (true) {
        ans = Math.floor(Math.random() * 9);
        if (ttt[ans] == 0) {
          return ans;
        }
      }
	}else if(this.difficulty == 2){
      // Check if board has already been won
	  //if(this.tttWins[this.activeBoard] != 0){
      if(0){
	    // If board has already been won play randomly
	    return this.computerMove(ttt);
	  }

	  // Check for immediate wins
	  ans = this.l2cw(ttt, 2);
	  if(ans != -1) return ans;

	  // Check for immediate losses
	  ans = this.l2cw(ttt, 1);
	  if(ans != -1) return ans;

	  // Play advantageous square if none of the above found
      ans = this.l2as(ttt);
	  return ans;
	}else{
	  return -1;
	}
  }

  // Level 2 Check Wins (/Losses)
  private l2cw(ttt: number[], p: number): number{
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
	return -1;
  }

  // Level 2 Advantageous Square
  private l2as(ttt: number[]): number{
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
}
