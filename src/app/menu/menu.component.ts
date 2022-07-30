import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  @Output() playGameEmitter = new EventEmitter();
  @Output() showInstructionsEmitter = new EventEmitter();

  handlePlayGame() {
    this.playGameEmitter.emit(false);
  }

  handlePlayComputer() {
    this.playGameEmitter.emit(true);
  }

  handleShowInstructions() {
    this.showInstructionsEmitter.emit();
  }
}