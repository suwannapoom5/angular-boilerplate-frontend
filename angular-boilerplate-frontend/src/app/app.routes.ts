import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { CommonOutletsComponent } from './outlets/common-outlets/common-outlets.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';
import { APITestingComponent } from './pages/apitesting/apitesting.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: CommonOutletsComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'apitesting',
        component: APITestingComponent
      },
      {
        path: 'sandbox',
        component: SandboxComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];