/**
* The main controller for the gameplay itself.
*/
import { Component, Output, EventEmitter, Input, } from '@angular/core';
@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
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

  @Input() boardState!: number[][];
  @Input() qWins!: number[];
  @Input() activeBoard!: number;
  @Input() computerPlayer!: number;
  @Input() gameTurn!: number;
  @Output() squareClickListener = new EventEmitter();

  qInit: number[];

  /**
   * CONSTRUCTOR
   * Board initialization goes here
   */
  constructor() {
    this.qInit = [0, 1, 2];
  }

  
  handleSquareClick(ids: Event) {
    this.squareClickListener.emit(ids);
  }

}
