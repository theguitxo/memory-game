import { Component, ChangeDetectionStrategy, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { TileImage } from 'src/app/interfaces/tile-image';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameGridComponent implements AfterViewInit {
  @ViewChild('gridContainer') gridContainer: ElementRef;

  /**
   * constructor method
   * @param gameService instance of the service that manage the game
   * @param renderer instance of the angular renderer service
   */
  constructor(
    private gameService: GameService,
    private renderer: Renderer2,
  ) { }

  /**
   * starts a subscription to control the tiles are loaded and it must start the cronometer
   */
  ngAfterViewInit(): void {
    this.gameService.tilesOk.subscribe((value) => {
      if (value) {
        this.renderer.setStyle(this.gridContainer.nativeElement, 'height', 'auto');
        this.renderer.removeStyle(this.gridContainer.nativeElement, 'opacity');
        this.gameService.startCronoGame();
      }
    });
  }

  /**
   * returns the tiles used in the game
   */
  getGameTiles(): Array<TileImage> {
    return this.gameService.tiles;
  }

  /**
   * returns the level selected by the user
   */
  getLevelClass(): string {
    return this.gameService.levelName;
  }

  /**
   * returns if the tiles are loaded
   */
  getTilesOk(): Observable<boolean> {
    return this.gameService.tilesOk;
  }
}
