import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablerIcon } from '../tabler-icon/tabler-icon-list';
import { TablerIconComponent } from '../tabler-icon/tabler-icon.component';
@Component({
  selector: 'app-common-modal',
  imports: [TablerIconComponent,],
  templateUrl: './common-modal.component.html',
  styleUrl: './common-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CommonModalComponent {
  constructor(private dialog: NgbModal, private activeModal: NgbActiveModal) { }

  @Input() modalType: 'success' | 'danger' | 'warning' = 'success'
  @Input() textTitle: string = ''
  @Input() htmlContent: SafeHtml | string = ''

  @Input() iconCancelBtn: string = ''
  @Input() textCancelBtn: string = 'ยกเลิก'
  @Input() showCancelBtn: boolean = true
  @Input() classCancelBtn: string = ''

  @Input() iconConfirmBtn: string = ''
  @Input() textConfirmBtn: string = 'ยืนยัน'
  @Input() showConfirmBtn: boolean = true
  @Input() classConfirmBtn: string = ''

  @Input() showModalHeader: boolean = false

  @Output() onClosePress = new EventEmitter<void>();
  @Output() onCancelPress = new EventEmitter<void>();
  @Output() onConfirmPress = new EventEmitter<void>();

  _TablerIcon = TablerIcon

  closeModal() {
    this.activeModal.dismiss('cancel');
  }

  confirm() {
    this.onConfirmPress.emit();
    this.activeModal.close('confirm');
  }

  cancel() {
    this.onCancelPress.emit();
    this.activeModal.dismiss('cancel');
  }
}