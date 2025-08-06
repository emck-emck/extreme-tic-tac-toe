import { Component, Input } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class Header {
  @Input() headerMsg: string;

  constructor() {
  }

}
