import { Routes } from '@angular/router';
import { authGuard } from '../app/core/guards/auth.guard';
import { CommonOutletsComponent } from './outlets/common-outlets/common-outlets.component';
import { HomeComponent } from './pages/home/home.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';

export const routes: Routes = [
  {
    path: '',
    component: CommonOutletsComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
    ],
  },
  {
    path: 'sandbox',
    component: CommonOutletsComponent,
    children: [{ path: '', component: SandboxComponent }],
  },
];
