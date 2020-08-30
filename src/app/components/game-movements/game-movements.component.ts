import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-movements',
  templateUrl: './game-movements.component.html',
  styleUrls: ['./game-movements.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMovementsComponent implements OnInit {

  constructor(
    public gameService: GameService,
  ) { }

  ngOnInit(): void {
  }

}
