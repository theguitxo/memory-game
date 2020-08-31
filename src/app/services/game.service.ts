import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, Subject } from 'rxjs';
import { takeUntil, map, repeatWhen } from 'rxjs/operators';
import { levels, levelNames, tiles } from '../enums/enums';
import { TileImage } from '../interfaces/tile-image';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // Subjects and Behaviors
  private started$: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);
  private cronoOn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly stopCrono$ = new Subject<void>();
  private readonly restartCrono$ = new Subject<void>();
  private tilesOk$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly hideTiles$: Subject<void> = new Subject<void>();
  private readonly showCursor$ = new Subject<void>();
  private winedGame$ = new Subject<boolean>();

  private crono$: Observable<string>;
  private secondsPlayed$;
  private secondsCrono$;
  private level$: levels = levels.easy;
  private tiles$: Array<TileImage>;
  private gameTilesKeys$: Array<string>;
  private selectedTile1$: TileImage;
  private selectedTile2$: TileImage;
  private tilesBlocked$: boolean;
  private points$: number;
  private movements$: number;
  private playedMoves$: number;
  private totalGameTiles$: number;
  private loadedGameTiles$: number;

  /**
   * constructor method
   */
  constructor() {
    this.initGameTiles();
  }

  /* SETTERS & GETTERS  */

  /* OBSERVABLES */

  get started(): Observable<boolean> {
    return this.started$.asObservable();
  }

  get crono(): Observable<string> {
    return this.crono$;
  }

  get tilesOk(): Observable<boolean> {
    return this.tilesOk$.asObservable();
  }

  get cronoOn(): Observable<boolean> {
    return this.cronoOn$.asObservable();
  }

  get hideTiles(): Observable<void> {
    return this.hideTiles$.asObservable();
  }

  get showCursor(): Observable<void> {
    return this.showCursor$.asObservable();
  }

  get winedGame(): Observable<boolean> {
    return this.winedGame$.asObservable();
  }

  /* VALUES */

  get secondsPlayed(): number {
    return this.secondsPlayed$;
  }

  get level(): levels {
    return this.level$;
  }
  set level(value: levels) {
    this.level$ = value;
  }

  get levelName(): string {
    if (this.level$ === levels.easy) {
      return levelNames.easy;
    } else if (this.level$ === levels.medium) {
      return levelNames.medium;
    }
    return levelNames.hard;
  }

  get tiles(): Array<TileImage> {
    return this.tiles$;
  }

  get tilesBlocked(): boolean {
    return this.tilesBlocked$;
  }
  set tilesBlocked(value: boolean) {
    this.tilesBlocked$ = value;
  }

  get points(): number {
    return this.points$;
  }

  get movements(): number {
    return this.movements$;
  }

  get timePlayedString(): string {
    return this.getTimeString();
  }

  get playedMoves(): number {
    return this.playedMoves$;
  }

  get secondTileSetted(): boolean {
    return (this.selectedTile2$ !== undefined && this.selectedTile2$ !== null);
  }
  /* METHODS */

  /**
   * chooses, randomly, the images from the list of tiles that will be used in the game
   */
  private initGameTiles(): void {
    this.tilesBlocked$ = false;
    const tilesKeys: Array<string> = Object.keys(tiles);
    this.gameTilesKeys$ = [];

    while (this.gameTilesKeys$.length < (Math.pow(levels.hard, 2) / 2)) {
      this.gameTilesKeys$.push(tilesKeys.splice(Math.floor(Math.random() * tilesKeys.length), 1).toString());
    }
  }

  /**
   * inits the grid of tiles for the game
   */
  private initGameGrid() {
    this.tilesOk$.next(false);
    this.loadedGameTiles$ = 0;
    this.totalGameTiles$ = Math.pow(this.level$, 2);
    const totalImages = this.totalGameTiles$ / 2;
    const images = Array()
      .concat(this.gameTilesKeys$.slice(0, totalImages))
      .concat(this.gameTilesKeys$.slice(0, totalImages));
    this.tiles$ = Array(this.totalGameTiles$).fill('').map(() => {
      const tileId = images.splice(Math.floor(Math.random() * images.length), 1).toString();
      const tile: TileImage = {
        id: tileId,
        path: `/assets/tiles/${tiles[tileId]}`,
        fixed: false,
      };
      return tile;
    });
  }

  /**
   * increase the number of loaded tiles and checks if all are loaded
   */
  tileLoaded(): void {
    this.loadedGameTiles$++;
    if (this.loadedGameTiles$ >= this.totalGameTiles$) {
      this.tilesOk$.next(true);
    }
  }

  /**
   * starts the game, inits properties and the grid
   */
  startGame(): void {
    this.movements$ = 0;
    this.points$ = 0;
    this.started$.next(true);
    this.initGameGrid();
  }

  /**
   * starts the cronometer of the game
   */
  startCronoGame(): void {
    this.secondsPlayed$ = 0;
    this.secondsCrono$ = 0;
    this.cronoOn$.next(true);
    this.playCrono();
  }

  /**
   * stops the game when user clicks on finish button
   */
  stopGame(): void {
    this.stopCrono$.next();
    this.secondsCrono$ = this.secondsPlayed$;
  }

  /**
   * finishes the game when user wins or decides to quit the game
   */
  finishGame(win: boolean = false): void {
    this.stopCrono$.next();
    this.cronoOn$.next(false);
    this.crono$ = null;
    this.movements$ = 0;
    this.started$.next(false);
    this.winedGame$.next(win);
  }

  /**
   * fires the subject to restart the cronometer
   */
  restartCrono(): void {
    this.restartCrono$.next();
  }

  /**
   * starts the crono
   */
  private playCrono(): void {
    this.crono$ = timer(0, 1000)
      .pipe(
        takeUntil(this.stopCrono$),
        repeatWhen(() => this.restartCrono$),
        map(val => this.updateTime(val))
      );
  }

  /**
   * updates the played time with the seconds counted
   * by the cronometer before pause (if it was paused)
   * and the new time counted
   * @param val seconds counted by the cronometer to add to seconds stored
   */
  private updateTime(val): string {
    this.secondsPlayed$ = this.secondsCrono$ + val;
    return this.getTimeString();
  }

  /**
   * it formattes a string from the seconds played by the user
   */
  private getTimeString(): string {
    const minutes: string = `0${(Math.floor(this.secondsPlayed$ / 60)).toString()}`.substr(-2);
    const seconds: string = `0${(this.secondsPlayed$ % 60).toString()}`.substr(-2);
    return `${minutes}:${seconds}`;
  }

  /**
   * set the tile chosen by the user and,
   * if it the second, checks if there are equals
   */
  setTurnTile(tile: TileImage): void {
    if (!this.selectedTile1$) {
      this.selectedTile1$ = tile;
      this.tilesBlocked$ = false;
    } else {
      this.selectedTile2$ = tile;
      this.checkSelectedTiles();
    }
  }

  /**
   * checks the selected tiles
   * if it are equals, increases the points and checks the game
   * otherwise, hide the tiles
   */
  private checkSelectedTiles(): void {
    let success = false;
    this.movements$++;
    if (this.selectedTile1$.id === this.selectedTile2$.id) {
      this.selectedTile1$.fixed = true;
      this.selectedTile2$.fixed = true;
      success = true;
    }
    this.delayShowTiles(success);
  }

  /**
   * fires a delay to hide the tiles after a move
   * @param success if the user was correct or not when choosing the tiles
   */
  private delayShowTiles(success: boolean): void {
    timer(success ? 500 : 1000).subscribe(() => {
      if (success) {
        this.increasePoints();
      } else {
        this.hideTiles$.next();
      }
      this.resetSelectedTiles();
      this.showCursor$.next();
    });
  }

  /**
   * reset the properties that contain the
   * information of the chosen tiles
   */
  private resetSelectedTiles(): void {
    this.selectedTile1$ = null;
    this.selectedTile2$ = null;
    this.tilesBlocked$ = false;
  }

  /**
   * increases the points (for each match, one point)
   * and checks if the user has been win the game
   */
  private increasePoints(): void {
    this.points$++;
    if (this.points$ === (this.totalGameTiles$ / 2)) {
      this.playedMoves$ = this.movements$;
      this.finishGame(true);
    }
  }
}
