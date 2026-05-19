import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { NgbCalendar, NgbCalendarBuddhist, NgbDateParserFormatter, NgbDatepickerI18n, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

import { provideTablerIcons } from 'angular-tabler-icons';

import { IconsList } from './shared/components/tabler-icon/tabler-icon-list';

import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';
import { provideQuillConfig } from 'ngx-quill/config';
import { NgbDateCustomParserFormatter } from './util/buddhist-date-parser-formatter';
import { NgbDatepickerI18nBuddhist } from './util/thai-buddhist-i18n';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: false,
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([])
    ),
    provideTablerIcons(IconsList),
    provideEnvironmentNgxMask(maskConfig),
    importProvidersFrom([
      NgbTooltipModule,
      NgbModule,
      QuillModule.forRoot()
    ]),
    {
      provide: NgbCalendar,
      useClass: NgbCalendarBuddhist,
    },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nBuddhist },
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateCustomParserFormatter,
    },
    provideQuillConfig({
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button

          ['link', 'image', 'video']                         // link and image, video
        ]
      }
    })
  ]
};
