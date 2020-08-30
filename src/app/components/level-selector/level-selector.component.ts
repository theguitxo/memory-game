import { Component, ChangeDetectionStrategy } from '@angular/core';
import { levels } from 'src/app/enums/enums';
import { GameService } from 'src/app/services/game.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-level-selector',
  templateUrl: './level-selector.component.html',
  styleUrls: ['./level-selector.component.scss'],
  host: {
    'style': 'width: 100%'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSelectorComponent {

  levelsValues: string[] = [];

  constructor(
    public gameService: GameService,
    private translate: TranslateService,
  ) {
    const levelsKeys = Object.keys(levels);
    this.levelsValues = levelsKeys.slice(-(levelsKeys.length / 2));
  }

  selectLevel(level: string) {
    this.gameService.level = levels[level];
  }

  getLevelString(level: string): string {
    return this.translate.instant(`level-selector.levels.${level}.title`);
  }
}
