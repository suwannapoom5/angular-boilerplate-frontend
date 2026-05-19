import { Injectable, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CustomToastComponent } from '../../../shared/components/custom-toast/custom-toast.component';
import { MasterDataApiService } from '../base-api/master-data-api.service';

type NotificationModel = any
type NotificationToastDetail = any

@Injectable({ providedIn: 'root' })
export class NotiSocketService {
  private ws?: WebSocket;
  private connected$ = new BehaviorSubject(false);


  private readonly noti_channel_name = 'system_user_noti'


  private noti_count_subject = new Subject<void>();
  public noti_count_subject$ = this.noti_count_subject.asObservable();

  private reconnectTimer: any = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectDelay = 30000; // 30 sec
  private readonly baseReconnectDelay = 1000; // 1 sec
  private manuallyClosed = false;
  private currentOfficerId?: string;
  private isConnecting = false;

  constructor(
    private zone: NgZone,
    private apiService: MasterDataApiService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    window.addEventListener('online', this.handleOnline);
  }

  private handleOnline = () => {
    if (!this.connected$.value && !this.manuallyClosed && this.currentOfficerId) {
      console.info('🌐 Network back online, reconnecting websocket...');
      this.scheduleReconnect(true);
    }
  };

  ngOnDestroy(): void {
    window.removeEventListener('online', this.handleOnline);
    this.clearReconnectTimer();
    this.disconnect();
  }

  async connect(officer_id: string) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN)) return;

    if (!this.currentOfficerId) {
      this.currentOfficerId = officer_id
    }
    const socketUrl = `${environment.WEBSOCKET_CHAT}/ws?channel=${this.noti_channel_name}${officer_id}`;
    this.ws = new WebSocket(socketUrl);

    this.ws.onopen = () => {
      this.zone.run(() => {
        console.info('🔗 WebSocket connected:', socketUrl);
        this.connected$.next(true);
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      });
    };

    this.ws.onmessage = async (event) => {
      this.zone.run(async () => {
        try {
          const toast_data: NotificationToastDetail = JSON.parse(event.data);


          let toastRef = this.toast.show(
            toast_data.msg,           // message (จะถูกใช้ใน component ด้วยผ่าน this.message)
            '',                       // title
            {
              toastComponent: CustomToastComponent,
              disableTimeOut: false,
              toastClass: '',
              // timeOut: 4000,
              closeButton: false,
              tapToDismiss: false,
              payload: toast_data,
            } as any
          );

          toastRef!.onTap.subscribe(() => {
            if (toast_data.param_path) {
              this.router.navigateByUrl(`/${toast_data.param_path}`)
            }
          });

          // await this.updateNotiCount()
          this.noti_count_subject.next();
          console.log(toast_data)
        } catch (error) {
          console.error(event.data, error);
        }
      })
    }
    this.ws.onclose = (event) => {
      this.zone.run(() => {
        console.warn('🔌 WebSocket closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });

        console.log(this.manuallyClosed, 'this.manuallyClosed')

        this.connected$.next(false);
        this.isConnecting = false;
        this.ws = undefined;

        if (!this.manuallyClosed && this.currentOfficerId) {
          this.scheduleReconnect();
        }
      });
    };
    this.ws.onerror = (e) => console.error('ws error', e);
  }

  private scheduleReconnect(forceImmediate = false): void {
    if (this.manuallyClosed || !this.currentOfficerId) return;
    if (this.reconnectTimer) return;

    const delay = forceImmediate
      ? 0
      : Math.min(
        this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
        this.maxReconnectDelay
      );

    console.warn(`♻️ Reconnecting websocket in ${delay} ms...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectAttempts++;
      this.connect(this.currentOfficerId!);
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  subscribeOfficerChannel(officerGuid: string) {
    const channel = `system_officer_noti${officerGuid}`;
    this.send({ action: 'subscribe', channel });
    return channel;
  }

  unsubscribe(channel: string) {
    this.send({ action: 'unsubscribe', channel });
  }

  onMessage<T = any>(): Observable<T> {
    return new Observable<T>((sub) => {
      const handler = (evt: MessageEvent) => {
        try {
          const data = JSON.parse(evt.data);
          this.zone.run(() => sub.next(data));
        } catch {
          // ถ้า server ส่ง text ธรรมดา
          this.zone.run(() => sub.next(evt.data as any));
        }
      };

      this.ws!.addEventListener('message', handler);
      return () => this.ws?.removeEventListener('message', handler);
    });
  }

  isConnected() {
    return this.connected$.asObservable();
  }

  private send(obj: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(obj));
  }

  disconnect() {
    this.ws?.close();
    this.ws = undefined;
    this.connected$.next(false);
  }

  getNotiCount(): Promise<{
    count: number
  }> {
    return new Promise((resolve, rejects) => {
      this.apiService.get('Notification/GetNotiCount').subscribe({
        next: res => {
          if (res.body?.data) {
            let result = res.body.data
            resolve(result)
          } else {
            rejects()
          }
        }, error: err => {
          rejects()
        }
      })
    })
  }

  getNotiList(body_opts?: {
    page: number,
    size: number
  }): Promise<{
    total_item: number
    data: NotificationModel[]
  }> {
    return new Promise((resolve, rejects) => {
      let body = {
        page: 1,
        size: 10
      }

      if (body_opts) {
        body = body_opts
      }

      this.apiService.post<NotificationModel[]>('Notification/GetNotiList', body).subscribe({
        next: res => {
          if (res.body?.data) {
            let result = {
              total_item: res.body.total_item,
              data: res.body.data || []
            }
            resolve(result)
          } else {
            rejects()
          }
        }, error: err => {
          rejects()
        }
      })
    })
  }

  updateNotiCount(): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.apiService.patch('Notification/UpdateNotiCount', {}).subscribe({
        next: res => {
          if (res.body?.data) {
            this.noti_count_subject.next();
            resolve()
          } else {
            rejects()
          }
        }, error: err => {
          rejects()
        }
      })
    })
  }

  markAsRead(body: {
    user_noti_id_list: string[],
    is_read_all: boolean
  }): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.apiService.patch('Notification/MarkAsRead', body).subscribe({
        next: res => {
          if (res.body?.data) {
            resolve()
          } else {
            rejects()
          }
        }, error: err => {
          rejects()
        }
      })
    })
  }

  deleteNoti(body: {
    user_noti_id_list: string[]
  }): Promise<void> {
    return new Promise((resolve, rejects) => {
      this.apiService.patch('Notification/DeleteNoti', body).subscribe({
        next: res => {
          if (res.body?.data) {
            resolve()
          } else {
            rejects()
          }
        }, error: err => {
          rejects()
        }
      })
    })
  }
}
