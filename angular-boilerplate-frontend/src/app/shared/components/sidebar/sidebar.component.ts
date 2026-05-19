import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

// import { TruncatePipe } from '../../pipes/truncate-text.pipe';
import { ScreenService } from '../../../core/services/helper/screen.service';
import { TablerIcon } from '../tabler-icon/tabler-icon-list';
import { TablerIconComponent } from '../tabler-icon/tabler-icon.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    TablerIconComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    // TruncatePipe,
    NgbTooltipModule,
    NgbPopoverModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  isCollapsed = false;
  isMobileSidebarVisible = false;

  isMobile$!: Observable<boolean>;
  isTablet$!: Observable<boolean>;
  isPc$!: Observable<boolean>;

  _TablerIcon: any = TablerIcon;
  _MenuEnum: any[] = [];

  menuItems: any[] = [];

  noti_count_socket_subsciprtion!: Subscription;
  noti_count = 0;

  submenuState = new Map<any, boolean>();

  constructor(
    private router: Router,
    private screenService: ScreenService,
  ) {
    this.isMobile$ = this.screenService.isMobile$();
    this.isTablet$ = this.screenService.isTablet$();
    this.isPc$ = this.screenService.isPc$();

    this.isMobile$.subscribe((isMobile) => {
      if (isMobile) {
        this.isCollapsed = false;
      } else {
        this.isMobileSidebarVisible = false;
      }
    });

    this.isTablet$.subscribe((isTablet) => {
      if (isTablet) {
        this.isCollapsed = false;
      } else {
        this.isMobileSidebarVisible = false;
      }
    });

    this.getNotiCount();
    this.getMenu();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.noti_count_socket_subsciprtion) {
      this.noti_count_socket_subsciprtion.unsubscribe();
    }
  }

  getNotiCount() {
    this.noti_count = 0;
  }

  getMenu() {
    this.menuItems = [
      {
        menu_id: 1,
        official_menu_id: 1,
        name: 'API Testing',
        icon_name: 'home',
        navigation_path: '/apitesting',
        sub_menu: null,
      },
      {
        menu_id: 2,
        official_menu_id: 2,
        name: 'Sandbox',
        icon_name: 'layout-grid',
        navigation_path: '/sandbox',
        sub_menu: null,
      },
      // {
      //   menu_id: 3,
      //   official_menu_id: 3,
      //   name: 'จัดการข้อมูล',
      //   icon_name: 'settings',
      //   navigation_path: null,
      //   sub_menu: [
      //     {
      //       menu_id: 31,
      //       official_menu_id: 31,
      //       name: 'จัดการผู้ใช้งาน',
      //       icon_name: 'users',
      //       navigation_path: '/user-management',
      //       sub_menu: null,
      //     },
      //     {
      //       menu_id: 32,
      //       official_menu_id: 32,
      //       name: 'จัดการสิทธิ์',
      //       icon_name: 'user-shield',
      //       navigation_path: '/user-role-management',
      //       sub_menu: null,
      //     },
      //     {
      //       menu_id: 33,
      //       official_menu_id: 33,
      //       name: 'ตั้งค่าระบบ',
      //       icon_name: 'settings',
      //       navigation_path: '/setting',
      //       sub_menu: null,
      //     },
      //   ],
      // },
      // {
      //   menu_id: 4,
      //   official_menu_id: 4,
      //   name: 'รายงาน',
      //   icon_name: 'report',
      //   navigation_path: null,
      //   sub_menu: [
      //     {
      //       menu_id: 41,
      //       official_menu_id: 41,
      //       name: 'รายงานภาพรวม',
      //       icon_name: 'file-chart',
      //       navigation_path: '/report',
      //       sub_menu: null,
      //     },
      //   ],
      // },
    ] as any[];
  }

  toggleSubmenu(item: any) {
    const current = this.submenuState.get(item) ?? true;
    this.submenuState.set(item, !current);
  }

  isSubmenuCollapsed(item: any): boolean {
    return this.submenuState.get(item) ?? true;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {
      this.submenuState.forEach((_, key) => {
        this.submenuState.set(key, true);
      });
    }
  }

  forceHide(menu_id: number | null): boolean {
    if (!menu_id) return false;
    return true;
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarVisible = !this.isMobileSidebarVisible;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarVisible = false;
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  closeSocket() {
    console.log('force disconnect');
  }

  goHomePage() {
    this.router.navigateByUrl('/');
  }
}