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
 
   isComputerPlayer: boolean;
 
   activeView: number; // 0 is menu, 1 is game, 2 is instructions
   constructor() {
     this.activeView = 0;
     this.isComputerPlayer = false;
   }
 
   handleMainMenu() {
     this.activeView = 0;
   }
 
   handleMenuPlayGame(e: Event) {
     this.activeView = 1;
     this.isComputerPlayer = Boolean(e);
   }
 
   handleShowInstructions() {
     this.activeView = 2;
   }
 }