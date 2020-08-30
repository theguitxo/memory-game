import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { tileImage } from 'src/app/interfaces/tile-image';
import { GameService } from 'src/app/services/game.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

enum tileStates {
  show,
  hidden,
}

@Component({
  selector: 'app-tile-item',
  templateUrl: './tile-item.component.html',
  styleUrls: ['./tile-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tileAnimation', [
      state(tileStates.show.toString(), style({ opacity: 1 })),
      state(tileStates.hidden.toString(), style({ opacity: 0 })),      
      transition(`${tileStates.show} <=> ${tileStates.hidden}`, animate('300ms ease-in')),
    ]),
  ]
})
export class TileItemComponent implements OnInit, OnDestroy {

  @Input() tile: tileImage;
  @ViewChild('tileRef') tileRef: ElementRef;

  tileState: tileStates = tileStates.hidden;
  hideTileSubscription: Subscription;
  showCursorSubscription: Subscription;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.hideTileSubscription = this.gameService.hideTiles.subscribe(() => { 
      if (this.tileState === tileStates.show && !this.tile.fixed) {        
        this.tileState = tileStates.hidden;
        this.cdr.markForCheck();  
      }      
    });
    this.showCursorSubscription = this.gameService.showCursor.subscribe(() => {      
      this.showCursor();
    });
  }

  ngOnDestroy(): void {
    this.hideTileSubscription.unsubscribe();
    this.showCursorSubscription.unsubscribe();
  }

  tileLoaded(): void {
    this.gameService.tileLoaded();
  }

  tileAnimationState(): tileStates {
    return this.tileState;
  }

  showTile(event: Event): void {
    event.stopPropagation();
    if (!this.gameService.tilesBlocked && this.tileState === tileStates.hidden) {
      this.gameService.tilesBlocked = true;
      this.tileState = tileStates.show;
    }
  }

  blockTile(tile: tileImage): void {
    this.hideCursor();
  }

  checkTile(tile: tileImage): void {
    if (this.tileState === tileStates.show) {
      this.gameService.setTurnTile(tile);
    } else if (this.tileState === tileStates.hidden) {
      this.gameService.tilesBlocked = false;      
    }
    if (!this.gameService.secondTileSetted) {
      this.showCursor();
    }
  }

  private showCursor(): void {
    this.renderer.removeClass(this.tileRef.nativeElement, 'no-cursor');
  }

  private hideCursor(): void {
    this.renderer.addClass(this.tileRef.nativeElement, 'no-cursor');
  }
}
