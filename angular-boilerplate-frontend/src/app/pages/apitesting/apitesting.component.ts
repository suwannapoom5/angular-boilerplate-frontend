import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenApiService } from '../../core/services/base-api/authen-api.service';
import { HeaderService } from '../../core/services/helper/header.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './apitesting.component.html',
  styleUrl: './apitesting.component.scss'
})
export class APITestingComponent {
  loading = false;
  result: any = null;

  constructor(
    private authenApi: AuthenApiService,
    private headerService: HeaderService,
  ) {}

  ngOnInit(): void {
    this.headerService.setHeader(
      'API Testing',
      'API Testing (GET / POST / PUT / PATCH / DELETE)'
    );
  }

  private showResult(res: any) {
    this.result = res?.body ?? res;
    console.log('API RESULT:', res);
  }

  private showError(err: any) {
    this.result = {
      error: true,
      message: err?.message || 'เกิดข้อผิดพลาด'
    };
    console.error(err);
  }

  testGet() {
    this.loading = true;

    this.authenApi.get('users', {
      page: 1,
      page_size: 10,
      search: ''
    }).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPost() {
    this.loading = true;

    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      is_active: true
    };

    this.authenApi.post('users', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPut() {
    this.loading = true;

    const payload = {
      name: 'Updated User',
      email: 'updated@example.com',
      is_active: true
    };

    this.authenApi.put('users/1', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPatch() {
    this.loading = true;

    const payload = {
      is_active: false
    };

    this.authenApi.patch('users/1/status', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testDelete() {
    this.loading = true;

    this.authenApi.delete('users/1').subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testDeleteWithBody() {
    this.loading = true;

    const payload = {
      ids: [1, 2, 3]
    };

    this.authenApi.delete_with_body('users', payload).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPostFormData() {
    this.loading = true;

    const formData = new FormData();
    formData.append('name', 'FormData User');
    formData.append('email', 'formdata@example.com');

    this.authenApi.post_formData('users/upload', formData).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPutFormData() {
    this.loading = true;

    const formData = new FormData();
    formData.append('name', 'Update FormData User');

    this.authenApi.put_formData('users/1/upload', formData).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testPatchFormData() {
    this.loading = true;

    const formData = new FormData();
    formData.append('is_active', 'true');

    this.authenApi.patch_formData('users/1/upload', formData).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testDeleteFormData() {
    this.loading = true;

    this.authenApi.delete_formData('users/file', {
      file_id: 1
    }).subscribe({
      next: res => this.showResult(res),
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testBlobGet() {
    this.loading = true;

    this.authenApi.blob_get('users/export').subscribe({
      next: blob => {
        this.result = {
          type: blob.type,
          size: blob.size
        };
      },
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  testBlobPost() {
    this.loading = true;

    const payload = {
      ids: [1, 2, 3]
    };

    this.authenApi.blob_post('users/export', payload).subscribe({
      next: blob => {
        this.result = {
          type: blob.type,
          size: blob.size
        };
      },
      error: err => this.showError(err),
      complete: () => this.loading = false
    });
  }

  clearResult() {
    this.result = null;
  }
}