import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { GameComponent } from './game/game.component';
import { HeaderComponent } from './header/header.component';
import { BoardComponent } from './board/board.component';
import { FooterComponent } from './footer/footer.component';
import { SquareComponent } from './square/square.component';
import { QuadrantComponent } from './quadrant/quadrant.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InstructionsComponent,
    GameComponent,
    HeaderComponent,
    BoardComponent,
    FooterComponent,
    SquareComponent,
    QuadrantComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
