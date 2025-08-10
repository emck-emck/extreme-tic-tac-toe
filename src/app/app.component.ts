/**
 * This is the master component, all roads lead to here.
 * There is a menu, instructions, and a game board and ther are switched between from here.
 */
 import { Component } from '@angular/core';

 @Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css'],
 })
 export class AppComponent {
 
   computerPlayer: number; // 0 is no computer, 1 is easy, 2 is hard
 
   activeView: number; // 0 is menu, 1 is game, 2 is instructions
   constructor() {
     this.activeView = 0;
     this.computerPlayer = 0;
   }
 
   handleMainMenu() {
     this.activeView = 0;
   }
 
   handleMenuPlayGame(e: Event) {
     this.computerPlayer = Number(e);
     this.activeView = 1;
   }
 
   handleShowInstructions() {
     this.activeView = 2;
   }
 }