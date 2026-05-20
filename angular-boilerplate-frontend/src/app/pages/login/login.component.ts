import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenApiService } from '../../core/services/base-api/authen-api.service';
import { HeaderService } from '../../core/services/helper/header.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loading = signal(false);
  username = signal('admin');
  password = signal('1234');
  result = signal<any>(null);

  constructor(
    private authenApi: AuthenApiService,
    private headerService: HeaderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.headerService.setHeader('Login', 'User Authentication');
  }

  private showError(err: any): void {
    this.result.set({
      error: true,
      status: err?.status,
      message: err?.error?.message || err?.message || 'เกิดข้อผิดพลาด',
      detail: err?.error ?? null,
    });

    console.error(err);
  }

  login(): void {
    this.loading.set(true);
    this.result.set(null);

    const payload = {
      username: this.username(),
      password: this.password(),
    };

    this.authenApi.post('api/auth/login', payload).subscribe({
      next: (res: any) => {
        const token = res?.body?.data?.access_token;

        if (token) {
          localStorage.setItem('access_token', token);
          this.authenApi.setHttpHeaders(token);

          this.result.set({
            login_success: true,
            token_saved: true,
          });

          this.router.navigate(['/apitesting']);
          return;
        }

        this.result.set({
          login_success: false,
          token_saved: false,
          message: 'ไม่พบ access_token',
        });
      },
      error: (err) => this.showError(err),
      complete: () => this.loading.set(false),
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');

    this.result.set({
      logout: true,
      message: 'ลบ Token แล้ว',
    });
  }

  showToken(): void {
    this.result.set({
      access_token: localStorage.getItem('access_token'),
    });
  }

  clearResult(): void {
    this.result.set(null);
  }
}
