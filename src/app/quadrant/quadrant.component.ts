import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameCommObj } from '../game-comm-obj.interface';

/**
 * This class is a controller for a single tic-tac-toe board within this larger context.
 */
@Component({
  selector: 'board-quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.css'],
})
export class QuadrantComponent {
  @Input() qid!: number;
  @Input() gameTurn!: number;
  @Input() isActive!: boolean;
  @Input() whoWon!: number;
  @Input() computerPlaySquares!: number[];
  @Output() squareClickListener = new EventEmitter();

  // Constructor variable
  boardInit: number[];

  constructor() {
    this.boardInit = [0, 1, 2];
  }

  handleSquareClick(ids: Event) {
    var obj: GameCommObj = JSON.parse(String(ids));
    obj['qid'] = this.qid;
    this.squareClickListener.emit(JSON.stringify(obj));
  }
}
