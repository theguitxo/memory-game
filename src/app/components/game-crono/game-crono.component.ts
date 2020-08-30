import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-crono',
  templateUrl: './game-crono.component.html',
  styleUrls: ['./game-crono.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCronoComponent implements OnInit {

  constructor(
    public gameService: GameService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.gameService.cronoOn.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

}
