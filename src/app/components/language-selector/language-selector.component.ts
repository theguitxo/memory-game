import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { languages } from 'src/app/enums/enums';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent implements OnInit {

  public langKeys: string[] = [];

  constructor(
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.langKeys = Object.keys(languages);
    this.langKeys = this.langKeys.slice(-(this.langKeys.length / 2));
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  getLanguageName(lang: string): string {
    return this.translate.instant(`language-selector.languages.${lang}.title`);
  }

  getLanguageIcon(lang: string): Observable<string> {    
    return this.translate.get(`language-selector.languages.${lang}.icon`)
      .pipe(map(data => `assets/icons/${data}.svg`));
  }
}
