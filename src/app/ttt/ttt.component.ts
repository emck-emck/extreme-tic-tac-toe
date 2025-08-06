import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * TTT stands for Tic-Tac-Toe, this class is a controller for a single tic-tac-toe board within this larger context.
 */
@Component({
  selector: 'ttt',
  templateUrl: './ttt.component.html',
  styleUrls: ['./ttt.component.css'],
})
export class TTT {
  @Input() qid: number;
  @Input() gameTurn: number;
  @Input() isActive: boolean;
  @Input() whoWon: number;
  @Input() computerPlaySquares: number[];
  @Output() squareClickListener = new EventEmitter();

  // Constructor variable
  boardInit: number[];

  constructor() {
    this.boardInit = [0, 1, 2];
  }

  handleSquareClick(ids: Event) {
    var obj: JSON = JSON.parse(String(ids));
    obj['qid'] = this.qid;
    this.squareClickListener.emit(JSON.stringify(obj));
  }
}
