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
  private _started: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);
  private _cronoOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _stopCrono = new Subject<void>();
  private readonly _restartCrono = new Subject<void>();
  private _tilesOk: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _hideTiles: Subject<void> = new Subject<void>();
  private readonly _showCursor = new Subject<void>();
  private _winedGame = new Subject<boolean>();

  private _crono: Observable<string>;
  private _secondsPlayed;
  private _secondsCrono;
  private _level: levels = levels.easy;
  private _tiles: Array<TileImage>;
  private _gameTilesKeys: Array<string>;
  private _selectedTile1: TileImage;
  private _selectedTile2: TileImage;
  private _tilesBlocked: boolean;
  private _points: number;
  private _movements: number;
  private _playedMoves: number;
  private _totalGameTiles: number;
  private _loadedGameTiles: number;

  /**
   * constructor method
   */
  constructor() {
    this.initGameTiles();
  }

  /* SETTERS & GETTERS  */

  /* OBSERVABLES */

  get started(): Observable<boolean> {
    return this._started.asObservable();
  }

  get crono(): Observable<string> {
    return this._crono;
  }

  get tilesOk(): Observable<boolean> {
    return this._tilesOk.asObservable();
  }

  get cronoOn(): Observable<boolean> {
    return this._cronoOn.asObservable();
  }

  get hideTiles(): Observable<void> {
    return this._hideTiles.asObservable();
  }

  get showCursor(): Observable<void> {
    return this._showCursor.asObservable();
  }

  get winedGame(): Observable<boolean> {
    return this._winedGame.asObservable();
  }

  /* VALUES */

  get secondsPlayed(): number {
    return this._secondsPlayed;
  }

  get level(): levels {
    return this._level;
  }
  set level(value: levels) {
    this._level = value;
  }

  get levelName(): string {
    if (this._level === levels.easy) {
      return levelNames.easy;
    } else if (this._level === levels.medium) {
      return levelNames.medium;
    }
    return levelNames.hard;
  }

  get tiles(): Array<TileImage> {
    return this._tiles;
  }

  get tilesBlocked(): boolean {
    return this._tilesBlocked;
  }
  set tilesBlocked(value: boolean) {
    this._tilesBlocked = value;
  }

  get points(): number {
    return this._points;
  }

  get movements(): number {
    return this._movements;
  }

  get timePlayedString(): string {
    return this.getTimeString();
  }

  get playedMoves(): number {
    return this._playedMoves;
  }

  get secondTileSetted(): boolean {
    return (this._selectedTile2 !== undefined && this._selectedTile2 !== null);
  }
  /* METHODS */

  /**
   * chooses, randomly, the images from the list of tiles that will be used in the game
   */
  private initGameTiles(): void {
    this._tilesBlocked = false;
    const tilesKeys: Array<string> = Object.keys(tiles);
    this._gameTilesKeys = [];

    while (this._gameTilesKeys.length < (Math.pow(levels.hard, 2) / 2)) {
      this._gameTilesKeys.push(tilesKeys.splice(Math.floor(Math.random() * tilesKeys.length), 1).toString());
    }
  }

  /**
   * inits the grid of tiles for the game
   */
  private initGameGrid() {
    this._tilesOk.next(false);
    this._loadedGameTiles = 0;
    this._totalGameTiles = Math.pow(this._level, 2);
    const totalImages = this._totalGameTiles / 2;
    const images = Array()
      .concat(this._gameTilesKeys.slice(0, totalImages))
      .concat(this._gameTilesKeys.slice(0, totalImages));
    this._tiles = Array(this._totalGameTiles).fill('').map(() => {
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
    this._loadedGameTiles++;
    if (this._loadedGameTiles >= this._totalGameTiles) {
      this._tilesOk.next(true);
    }
  }

  /**
   * starts the game, inits properties and the grid
   */
  startGame(): void {
    this._movements = 0;
    this._points = 0;
    this._started.next(true);
    this.initGameGrid();
  }

  /**
   * starts the cronometer of the game
   */
  startCronoGame(): void {
    this._secondsPlayed = 0;
    this._secondsCrono = 0;
    this._cronoOn.next(true);
    this.playCrono();
  }

  /**
   * stops the game when user clicks on finish button
   */
  stopGame(): void {
    this._stopCrono.next();
    this._secondsCrono = this._secondsPlayed;
  }

  /**
   * finishes the game when user wins or decides to quit the game
   */
  finishGame(win: boolean = false): void {
    this._stopCrono.next();
    this._cronoOn.next(false);
    this._crono = null;
    this._movements = 0;
    this._started.next(false);
    this._winedGame.next(win);
  }

  /**
   * fires the subject to restart the cronometer
   */
  restartCrono(): void {
    this._restartCrono.next();
  }

  /**
   * starts the crono
   */
  private playCrono(): void {
    this._crono = timer(0, 1000)
      .pipe(
        takeUntil(this._stopCrono),
        repeatWhen(() => this._restartCrono),
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
    this._secondsPlayed = this._secondsCrono + val;
    return this.getTimeString();
  }

  /**
   * it formattes a string from the seconds played by the user
   */
  private getTimeString(): string {
    const minutes: string = `0${(Math.floor(this._secondsPlayed / 60)).toString()}`.substr(-2);
    const seconds: string = `0${(this._secondsPlayed % 60).toString()}`.substr(-2);
    return `${minutes}:${seconds}`;
  }

  /**
   * set the tile chosen by the user and,
   * if it the second, checks if there are equals
   */
  setTurnTile(tile: TileImage): void {
    if (!this._selectedTile1) {
      this._selectedTile1 = tile;
      this._tilesBlocked = false;
    } else {
      this._selectedTile2 = tile;
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
    this._movements++;
    if (this._selectedTile1.id === this._selectedTile2.id) {
      this._selectedTile1.fixed = true;
      this._selectedTile2.fixed = true;
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
        this._hideTiles.next();
      }
      this.resetSelectedTiles();
      this._showCursor.next();
    });
  }

  /**
   * reset the properties that contain the
   * information of the chosen tiles
   */
  private resetSelectedTiles(): void {
    this._selectedTile1 = null;
    this._selectedTile2 = null;
    this._tilesBlocked = false;
  }

  /**
   * increases the points (for each match, one point)
   * and checks if the user has been win the game
   */
  private increasePoints(): void {
    this._points++;
    if (this._points === (this._totalGameTiles / 2)) {
      this._playedMoves = this._movements;
      this.finishGame(true);
    }
  }
}
