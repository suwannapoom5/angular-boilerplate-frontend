import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthenApiService } from '../../core/services/base-api/authen-api.service';
import { HeaderService } from '../../core/services/helper/header.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './apitesting.component.html',
  styleUrl: './apitesting.component.scss'
})
export class APITestingComponent implements OnInit {

  loading = false;
  result: any = null;

  constructor(
    private authenApi: AuthenApiService,
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.setHeader(
      'API Testing',
      'API Testing (GET / POST / PUT / PATCH / DELETE)'
    );
  }

  private showResult(res: any): void {
    this.result = res?.body ?? res;
    console.log('API RESULT:', res);
  }

  private showError(err: any): void {
    this.result = {
      error: true,
      status: err?.status,
      message: err?.error?.message || err?.message || 'เกิดข้อผิดพลาด',
      detail: err?.error ?? null
    };

    console.error(err);
  }

  private startLoading(): void {
    this.loading = true;
    this.result = null;
  }

  testGet(): void {
    this.startLoading();

    this.authenApi.get('api/users', {
      page: 1,
      page_size: 10,
    }).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPost(): void {
    this.startLoading();

    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      is_active: true
    };

    this.authenApi.post('api/users', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPut(): void {
    this.startLoading();

    const payload = {
      name: 'Updated User',
      email: 'updated@example.com',
      is_active: true
    };

    this.authenApi.put('api/users/1', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPatch(): void {
    this.startLoading();

    const payload = {
      is_active: false
    };

    this.authenApi.patch('api/users/1/status', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testDelete(): void {
    this.startLoading();

    this.authenApi.delete('api/users/1').subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testDeleteWithBody(): void {
    this.startLoading();

    const payload = {
      ids: [1, 2, 3]
    };

    this.authenApi.delete_with_body('api/users', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPostFormData(): void {
    this.startLoading();

    const formData = new FormData();

    formData.append('name', 'FormData User');
    formData.append('email', 'formdata@example.com');

    this.authenApi.post_formData(
      'api/users/upload',
      formData
    ).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPutFormData(): void {
    this.startLoading();

    const formData = new FormData();

    formData.append(
      'name',
      'Update FormData User'
    );

    this.authenApi.put_formData(
      'api/users/1/upload',
      formData
    ).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPatchFormData(): void {
    this.startLoading();

    const formData = new FormData();

    formData.append(
      'is_active',
      'true'
    );

    this.authenApi.patch_formData(
      'api/users/1/upload',
      formData
    ).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testDeleteFormData(): void {
    this.startLoading();

    this.authenApi.delete_formData(
      'api/users/file',
      {
        file_id: 1
      }
    ).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testBlobGet(): void {
    this.startLoading();

    this.authenApi.blob_get(
      'api/users/export'
    ).subscribe({
      next: blob => {
        this.result = {
          type: blob.type,
          size: blob.size,
          message: 'Export GET สำเร็จ'
        };
      },
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testBlobPost(): void {
    this.startLoading();

    const payload = {
      ids: [1, 2, 3]
    };

    this.authenApi.blob_post(
      'api/users/export',
      payload
    ).subscribe({
      next: blob => {
        this.result = {
          type: blob.type,
          size: blob.size,
          message: 'Export POST สำเร็จ'
        };
      },
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  clearResult(): void {
    this.result = null;
  }
}