import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ScreenService } from '../../core/services/helper/screen.service';

@Component({
  selector: 'app-common-outlets',
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './common-outlets.component.html',
  styleUrl: './common-outlets.component.scss'
})
export class CommonOutletsComponent {
  isMobile$!: Observable<boolean>;
  isTablet$!: Observable<boolean>;
  isPc$!: Observable<boolean>;

  constructor(
    private screenService: ScreenService,
  ) {
    this.isMobile$ = this.screenService.isMobile$();
    this.isTablet$ = this.screenService.isTablet$();
    this.isPc$ = this.screenService.isPc$();
  }
}
