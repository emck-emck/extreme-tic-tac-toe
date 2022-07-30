/**
 * This is component of the program the user interacts with the most.
 * Each square is a piece of the game board.
 */

 import { Component, EventEmitter, Input, Output } from '@angular/core';
 import { GameCommObj } from '../game-comm-obj.interface';

 @Component({
   selector: 'quadrant-square',
   templateUrl: './square.component.html',
   styleUrls: ['./square.component.css'],
 })
 export class SquareComponent {
   @Input() id!: number;
   @Input() gameTurn!: number;
   @Input() isActive!: boolean;
   @Input() computerPlay!: boolean;
   @Output() squareClickListener = new EventEmitter();
   p1Play: boolean;
   p2Play: boolean;
 
   constructor() {
     this.p1Play = false;
     this.p2Play = false;
   }
 
   // Handles click event
   handleSquareClick() {
     // We only care about unclicked squares
     if (this.isActive && !this.p1Play && !this.p2Play) {
       // Initialize JSON to tell parent
       var obj: GameCommObj = JSON.parse('{}');
       obj['sid'] = this.id;
       if (this.gameTurn % 2 == 0) {
         obj['pid'] = 1;
       } else {
         obj['pid'] = 2;
       }
 
       // Locks the square for future clicks
       // Handles CSS elements
       if (this.gameTurn % 2 == 0) {
         this.p1Play = true;
         this.p2Play = false;
       } else {
         this.p1Play = false;
         this.p2Play = true;
       }
 
       // Tell parent
       this.squareClickListener.emit(JSON.stringify(obj));
     }
   }
 }
 