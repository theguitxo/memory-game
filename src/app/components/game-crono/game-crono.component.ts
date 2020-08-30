import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-crono',
  templateUrl: './game-crono.component.html',
  styleUrls: ['./game-crono.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCronoComponent implements OnInit {

  /**
   * constructor method
   * @param gameService instance of the service that manage the game
   * @param cdr instance of the service for detect changes
   */
  constructor(
    public gameService: GameService,
    private cdr: ChangeDetectorRef,
  ) { }

  /**
   * ngOnInit
   * starts a subscription to control if the crono is started to check the changes in the view
   */
  ngOnInit(): void {
    this.gameService.cronoOn.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

}
