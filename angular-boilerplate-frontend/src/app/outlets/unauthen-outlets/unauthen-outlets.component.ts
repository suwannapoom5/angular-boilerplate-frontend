import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { ScreenService } from '../../service/helper/screen.service';

@Component({
  selector: 'app-unauthen-outlets',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './unauthen-outlets.component.html',
  styleUrl: './unauthen-outlets.component.scss'
})
export class UnauthenOutletsComponent {
  isMobile$!: Observable<boolean>;
  isTablet$!: Observable<boolean>;
  isPc$!: Observable<boolean>;

  showCoverImg: boolean = false;

  constructor(
    private screenService: ScreenService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      let route = this.route;
      while (route.firstChild) {
        route = route.firstChild;
      }

      this.showCoverImg = !!route.snapshot.data['showCoverImg'];
    });

    this.isMobile$ = this.screenService.isMobile$();
    this.isTablet$ = this.screenService.isTablet$();
    this.isPc$ = this.screenService.isPc$();
  }
}
