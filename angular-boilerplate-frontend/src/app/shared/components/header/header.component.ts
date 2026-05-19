import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

import { NotificationListComponent } from '../notification-list/notification-list.component';
import { CommonService } from '../../../core/services/helper/common.service';
import { HeaderService } from '../../../core/services/helper/header.service';
import { ScreenService } from '../../../core/services/helper/screen.service';
import { CommonModalComponent } from '../common-modal/common-modal.component';
import { TablerIcon } from '../tabler-icon/tabler-icon-list';
import { TablerIconComponent } from '../tabler-icon/tabler-icon.component';

type NotificationModel = any;

@Component({
  selector: 'app-header',
  imports: [CommonModule, TablerIconComponent, NotificationListComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  _TablerIcon = TablerIcon;

  @Input() unAuthen = false;

  isMobile$!: Observable<boolean>;
  isTablet$!: Observable<boolean>;
  isPc$!: Observable<boolean>;

  selectedNotiMobile: NotificationModel | null = null;

  userDetail: any = {
    user_id: 1,
    firstname: 'Sandbox',
    lastname: 'Admin',
    email: 'sandbox@example.com',
    role_name: 'ผู้ดูแลระบบ'
  };

  menuList: any[] = [
    {
      menu_id: 1,
      name: 'Dashboard',
      navigation_path: '/dashboard'
    },
    {
      menu_id: 2,
      name: 'Sandbox',
      navigation_path: '/sandbox'
    }
  ];

  isNotiMobileDetailOpen = false;
  private subscriptions: Subscription[] = [];

  title = 'Sandbox';
  subTitle = 'Test Subtitle Text';

  chat_noti_count = 0;

  constructor(
    private router: Router,
    private dialog: NgbModal,
    private commonService: CommonService,
    private screenService: ScreenService,
    private headerService: HeaderService
  ) {
    this.isMobile$ = this.screenService.isMobile$();
    this.isTablet$ = this.screenService.isTablet$();
    this.isPc$ = this.screenService.isPc$();

    this.initClearStateResponsive();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.headerService.title$.subscribe(res => this.title = res || 'Sandbox'),
      this.headerService.subTitle$.subscribe(res => this.subTitle = res || 'Test Subtitle Text')
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleNotiMobileDetailcanvas(noti?: NotificationModel): void {
    this.isNotiMobileDetailOpen = !this.isNotiMobileDetailOpen;
    this.selectedNotiMobile = noti || null;
  }

  initClearStateResponsive() {
    this.subscriptions.push(
      this.isMobile$.subscribe(() => {
        this.isNotiMobileDetailOpen = false;
      }),
      this.isTablet$.subscribe(() => {
        this.isNotiMobileDetailOpen = false;
      }),
      this.isPc$.subscribe(() => {
        this.isNotiMobileDetailOpen = false;
      })
    );
  }

  goLoginPage() {
    this.router.navigateByUrl('/auth/login');
  }

  goPointSummaryPage() {
    this.router.navigateByUrl('/');
  }

  goMemberPage() {
    this.router.navigateByUrl('/');
  }

  goUserRequestPage() {
    this.router.navigateByUrl('/');
  }

  goHomePage() {
    this.router.navigateByUrl('/');
  }

  goConsentPage() {
    this.router.navigateByUrl('/');
  }

  goAgriAreaPage() {
    this.router.navigateByUrl('/');
  }

  goCalendarPage() {
    this.router.navigateByUrl('/');
  }

  goShopPage() {
    this.router.navigateByUrl('/');
  }

  goServicePage() {
    this.router.navigateByUrl('/');
  }

  goChatPage() {
    this.router.navigateByUrl('/');
  }

  logout() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true,
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'danger';
    dialogInst.htmlContent = 'คุณต้องการจะออกจากระบบ?';
    dialogInst.iconConfirmBtn = 'logout';
    dialogInst.textConfirmBtn = 'ออกจากระบบ';

    dialogInst.onConfirmPress.subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  checkPermission(menu_id: number, permission_type: number): boolean {
    return true;
  }
}