import { Component, ChangeDetectionStrategy, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { tileImage } from 'src/app/interfaces/tile-image';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameGridComponent implements AfterViewInit {
  @ViewChild('gridContainer') gridContainer: ElementRef;

  constructor(
    private gameService: GameService,
    private renderer: Renderer2,
  ) { }

  ngAfterViewInit(): void {
    this.gameService.tilesOk.subscribe((value) => {
      if (value) {
        this.renderer.setStyle(this.gridContainer.nativeElement, 'height', 'auto');
        this.renderer.removeStyle(this.gridContainer.nativeElement, 'opacity');
        this.gameService.startCronoGame();
      }
    });  
  }

  getGameTiles(): Array<tileImage> {
    return this.gameService.tiles;
  }

  getLevelClass(): string {
    return this.gameService.levelName;
  }

  getTilesOk(): Observable<boolean> {
    return this.gameService.tilesOk;
  }
}
