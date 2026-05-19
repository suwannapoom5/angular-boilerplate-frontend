import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { CommonModalComponent } from '../../../shared/components/common-modal/common-modal.component';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { TablerIcon } from '../../../shared/components/tabler-icon/tabler-icon-list';
import { TablerIconComponent } from '../../../shared/components/tabler-icon/tabler-icon.component';
import { ThaidatePipe } from '../../../shared/pipes/thaidate.pipe';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BlockUiService } from '../../../core/services/helper/block-ui.service';
import { ScreenService } from '../../../core/services/helper/screen.service';
import { NotiSocketService } from '../../../core/services/notification/noti-socket.service';

type NotificationModel = any

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule, ThaidatePipe, TablerIconComponent, DropdownComponent],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent {
  _TablerIcon = TablerIcon

  _MenuEnum: any[] = [];

  menuItems: any[] = [];

  noti_list: NotificationModel[] = []

  page: number = 1
  size: number = 20

  isMobile$!: Observable<boolean>;
  isTablet$!: Observable<boolean>;
  isPc$!: Observable<boolean>;

  noti_count_socket_subsciprtion!: Subscription
  noti_count: number = 0

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private dialog: NgbModal,
    private authService: AuthService,
    private notiSocketSrv: NotiSocketService,
    private blockUI: BlockUiService,
    private screenService: ScreenService,
    private toast: ToastrService
  ) {
    this.isMobile$ = this.screenService.isMobile$();
    this.isTablet$ = this.screenService.isTablet$();
    this.isPc$ = this.screenService.isPc$();

    this.page = 1
    // this.getNotifications()
    // this.getNotiCount()
  }


  ngOnDestroy(): void {
    // this.noti_count_socket_subsciprtion.unsubscribe()
  }

  getNotiCount() {
    this.notiSocketSrv.getNotiCount().then((res) => {
      this.noti_count = res.count ?? 0
    })

    this.noti_count_socket_subsciprtion = this.notiSocketSrv.noti_count_subject$.subscribe(() => {
      this.notiSocketSrv.getNotiCount().then((res) => {
        this.noti_count = res.count ?? 0
      })
    })
  }

  openNoti() {
    // this.getNotifications();
  }

  getNotifications(page?: number) {
    // let body = {
    //   page: page ?? 1,
    //   size: this.size
    // }

    let body = {
      page: 1,
      size: 10000
    }


    this.notiSocketSrv.getNotiList(body).then((noti_data: {
      total_item: number
      data: NotificationModel[]
    }) => {
      let noti_list = noti_data.data

      // if (body.page == 1) {
      //   this.noti_list = []
      //   this.noti_list = noti_list
      // } else {
      //   this.noti_list = [...this.noti_list, ...noti_list]
      // }

      this.noti_list = noti_list
    }).finally(() => {
    })
  }


  getSafeHTML(html_str: string | null) {
    if (!html_str) {
      return ''
    }

    return this.sanitizer.bypassSecurityTrustHtml(html_str)
  }

  async goRouteNoti(noti: NotificationModel) {
    if (!noti.param_path) {
      return
    }

    this.getNotifications()
    let showNoti = false;
    await this.markReadNoti(noti, showNoti)
    await this.notiSocketSrv.updateNotiCount()
    this.router.navigateByUrl(`/${noti.param_path}`)
  }

  async markAllAsRead() {
    let body = {
      user_noti_id_list: [],
      is_read_all: true
    }

    let showNoti = true
    await this.callMarkAsRead(body, showNoti)
  }

  async markReadNoti(noti: NotificationModel, showNoti = true) {
    let body = {
      user_noti_id_list: [noti.user_noti_id],
      is_read_all: false
    }

    await this.callMarkAsRead(body, showNoti)
  }

  async callMarkAsRead(body: {
    user_noti_id_list: string[],
    is_read_all: boolean
  }, showNoti: boolean) {
    await this.notiSocketSrv.markAsRead(body).then(() => {
      if (showNoti) {
        this.toast.success('ทำเครื่องหมายอ่านที่การแจ้งเตือนแล้วเรียบร้อยแล้ว', 'ทำเครื่องหมายอ่านแล้วสำเร็จ')
      }
    })
    this.getNotifications()
  }

  deleteNoti(noti: NotificationModel) {
    let dialog = this.dialog.open(CommonModalComponent, {
      centered: true,
    });

    let dialogInst = dialog.componentInstance as CommonModalComponent

    dialogInst.modalType = 'danger';
    dialogInst.htmlContent = 'คุณต้องการจะลบข้อความนี้?';
    dialogInst.textConfirmBtn = 'ลบข้อความ';
    dialogInst.onConfirmPress.subscribe((value) => {
      let body = {
        user_noti_id_list: [noti.user_noti_id]
      }
      this.notiSocketSrv.deleteNoti(body).then(() => {
        this.toast.success('การแจ้งเตือนที่เลือกถูกลบเรียบร้อยแล้ว', 'ลบข้อความสำเร็จ')
      })
    })
  }

  checkPermission(menu_id: number, permission_type: number): boolean {
    return this.authService.checkPermission(menu_id, permission_type)
  }

  getNotiRowClass(noti: NotificationModel): string {
    const map: Record<string, string> = {
      success: 'text-success',
      danger: 'text-danger',
      warning: 'text-warning',
      info: 'text-info',
    };

    const key = (noti?.css_class || '').toLowerCase().trim();
    return map[key] ?? '';
  }
}
