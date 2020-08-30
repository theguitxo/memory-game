import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent {
  /**
   * constructor method
   * @param gameService instance of the service that manage the game
   */
  constructor(
    public gameService: GameService,
  ) { }
}
