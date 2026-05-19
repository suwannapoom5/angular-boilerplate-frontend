// <reference types="@angular/localize" />
import 'zone.js';
import { registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

import localeTh from '@angular/common/locales/th';

registerLocaleData(localeTh);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
