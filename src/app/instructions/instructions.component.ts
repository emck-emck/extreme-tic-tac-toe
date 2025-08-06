import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css'],
})
export class Instructions {
  @Output() backToMenuEmitter = new EventEmitter();
  constructor() {}

  handleBackToMenuClick() {
    this.backToMenuEmitter.emit();
  }
}
