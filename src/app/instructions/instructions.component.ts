import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css'],
})
export class InstructionsComponent {
  @Output() backToMenuEmitter = new EventEmitter();
  constructor() {}

  handleBackToMenuClick() {
    this.backToMenuEmitter.emit();
  }
}
