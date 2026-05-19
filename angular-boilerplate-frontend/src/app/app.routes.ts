import { Routes } from '@angular/router';
import { authGuard } from '../app/core/guards/auth.guard';
import { CommonOutletsComponent } from './outlets/common-outlets/common-outlets.component';
import { SandboxComponent } from './pages/sandbox/sandbox.component';
import { APITestingComponent } from './pages/apitesting/apitesting.component'

export const routes: Routes = [
  {
    path: '',
    component: CommonOutletsComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: APITestingComponent },
    ],
  },
  {
    path: 'apitesting',
    component: CommonOutletsComponent,
    children: [{ path: '', component: APITestingComponent }],
  },
  {
    path: 'sandbox',
    component: CommonOutletsComponent,
    children: [{ path: '', component: SandboxComponent }],
  },
];
