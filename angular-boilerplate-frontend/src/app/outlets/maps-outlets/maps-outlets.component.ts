import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ScreenService } from '../../service/helper/screen.service';

@Component({
  selector: 'app-maps-outlets',
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './maps-outlets.component.html',
  styleUrl: './maps-outlets.component.scss'
})
export class MapsOutletsComponent {
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
