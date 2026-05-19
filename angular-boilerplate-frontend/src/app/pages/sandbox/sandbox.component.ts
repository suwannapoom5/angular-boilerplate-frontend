import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HeaderService } from '../../core/services/helper/header.service';
import { AlertService } from '../../core/services/helper/alert.service';

import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { CommonModalComponent } from '../../shared/components/common-modal/common-modal.component';
import { TablerIcon } from '../../shared/components/tabler-icon/tabler-icon-list';
import { TablerIconComponent } from '../../shared/components/tabler-icon/tabler-icon.component';

@Component({
  selector: 'app-sandbox',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconComponent,
    DatePickerComponent
  ],
  templateUrl: './sandbox.component.html',
  styleUrl: './sandbox.component.scss'
})
export class SandboxComponent {
  _TablerIcon = TablerIcon;

  submission_date: string | null = null;
  isEditMode = false;

  constructor(
    private headerService: HeaderService,
    private dialog: NgbModal,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.headerService.setHeader('Sandbox', 'Test Dialog / Alert');
  }

  openWarningDialog() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'warning';
    dialogInst.htmlContent = `
      <div class="text-center">
        <div class="fw-semibold fs-5 mb-2">
          ยืนยันการดำเนินการ
        </div>
        <div class="text-muted">
          กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการต่อ
        </div>
      </div>
    `;
    dialogInst.classConfirmBtn = 'btn btn-success';
    dialogInst.textConfirmBtn = 'ยืนยัน';

    dialogInst.onConfirmPress.subscribe(() => {
      dialog.close();
      this.alert.success('ดำเนินการเรียบร้อยแล้ว');
    });
  }

  openSaveDialog() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'warning';
    dialogInst.htmlContent = 'คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่?';
    dialogInst.classConfirmBtn = 'btn btn-success';
    dialogInst.textConfirmBtn = 'บันทึก';

    dialogInst.onConfirmPress.subscribe(() => {
      dialog.close();
      this.alert.success('บันทึกข้อมูลเรียบร้อยแล้ว');
    });
  }

  openEditDialog() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'warning';
    dialogInst.htmlContent = 'คุณต้องการยืนยันการแก้ไขข้อมูลนี้ใช่หรือไม่?';
    dialogInst.classConfirmBtn = 'btn btn-success';
    dialogInst.textConfirmBtn = 'ยืนยัน';

    dialogInst.onConfirmPress.subscribe(() => {
      dialog.close();
      this.alert.success('แก้ไขข้อมูลเรียบร้อยแล้ว');
    });
  }

  openDeleteDialog() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'danger';
    dialogInst.htmlContent = 'คุณต้องการลบข้อมูลนี้ใช่หรือไม่?';
    dialogInst.classConfirmBtn = 'btn btn-danger';
    dialogInst.textConfirmBtn = 'ลบข้อมูล';

    dialogInst.onConfirmPress.subscribe(() => {
      dialog.close();
      this.alert.deleteSuccess('ลบข้อมูลเรียบร้อยแล้ว');
    });
  }

  openStatusDialog() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'warning';
    dialogInst.htmlContent = 'คุณต้องการเปลี่ยนสถานะการใช้งานใช่หรือไม่?';
    dialogInst.classConfirmBtn = 'btn btn-success';
    dialogInst.textConfirmBtn = 'ยืนยัน';

    dialogInst.onConfirmPress.subscribe(() => {
      dialog.close();
      this.alert.success('เปลี่ยนสถานะเรียบร้อยแล้ว');
    });
  }

  openErrorDialog() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'danger';
    dialogInst.htmlContent = 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง';
    dialogInst.classConfirmBtn = 'btn btn-danger';
    dialogInst.textConfirmBtn = 'ตกลง';
  }

  openSuccessDialog() {
    const dialog = this.dialog.open(CommonModalComponent, {
      centered: true
    });

    const dialogInst = dialog.componentInstance as CommonModalComponent;

    dialogInst.modalType = 'success';
    dialogInst.htmlContent = 'ดำเนินการสำเร็จ';
    dialogInst.classConfirmBtn = 'btn btn-success';
    dialogInst.textConfirmBtn = 'ตกลง';
  }

  showAlertSuccess() {
    this.alert.success('บันทึกข้อมูลเรียบร้อยแล้ว');
  }

  showAlertEditSuccess() {
    this.alert.success('แก้ไขข้อมูลเรียบร้อยแล้ว');
  }

  showAlertDeleteSuccess() {
    this.alert.deleteSuccess('ลบข้อมูลเรียบร้อยแล้ว');
  }
}