import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AuthService } from '../../../core/services/auth/auth.service';
import { MasterDataApiService } from '../../../core/services/base-api/master-data-api.service';
import { BlockUiService } from '../../../core/services/helper/block-ui.service';

type Consent = any;

@Component({
  selector: 'app-accept-consent-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './accept-consent-modal.component.html',
  styleUrl: './accept-consent-modal.component.scss'
})
export class AcceptConsentModalComponent implements AfterViewInit {
  @ViewChild('scrollBox') scrollBox!: ElementRef<HTMLDivElement>;

  userDetail: any;
  consent: Consent | null = null;
  isAccept = false;
  viewOnly = false;

  consentDetail: SafeHtml | string = '';
  consentScrolledToBottom = false;

  constructor(
    private apiService: MasterDataApiService,
    private blockUI: BlockUiService,
    private authService: AuthService,
    private activeDialog: NgbActiveModal,
    private sanitizer: DomSanitizer
  ) {
    this.getConsent();
  }

  ngAfterViewInit(): void {
    const el = this.scrollBox.nativeElement;
    if (el.scrollHeight <= el.clientHeight) {
      this.consentScrolledToBottom = true;
    }
  }

  getConsent() {
    this.apiService.get<Consent>('MasterData/GetConsent').subscribe((res) => {
      if (res.body) {
        this.consent = res.body?.data;
        this.consentDetail = this.sanitizer.bypassSecurityTrustHtml(this.consent?.detail || '');
      }
    });
  }

  onSubmit() {
    const body = {
      user_id: this.userDetail?.id
    };

    this.apiService.patch('Authen/AcceptLastestConsent', body).subscribe((res) => {
      if (res.body) {
        this.consent = res.body?.data;
      }
    });

    this.closeModal();
  }

  closeModal() {
    this.activeDialog.dismiss();
  }

  onScrollConsent(event: Event) {
    const target = event.target as HTMLElement;
    const atBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 1;

    if (atBottom) {
      this.consentScrolledToBottom = atBottom;
    }
  }
}