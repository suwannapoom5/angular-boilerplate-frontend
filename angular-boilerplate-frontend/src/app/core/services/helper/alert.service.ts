import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  private showAlert({
    type = 'success',
    title = '',
    detailText = '',
    showCloseButton = true,
    showConfirmButton = false,
    confirmButtonText = '',
  }: {
    type?: 'success' | 'warning' | 'error' | 'delete' | 'logout' | 'transfer';
    title?: string;
    detailText?: string;
    showCloseButton?: boolean;
    showConfirmButton?: boolean;
    confirmButtonText?: string;
  }) {
    return Swal.fire({
      title,
      html: `
        <p class="mb-0 " style="white-space: pre-line;">${detailText}</p>
      `,
      imageUrl: `./assets/imgs/icon/${type}-icon.svg`,
      animation: true,
      showClass: {
        popup:
          'rounded-custom animate__animated animate__fadeZoomIn animate__faster',
      },
      hideClass: {
        popup:
          'rounded-custom animate__animated animate__fadeZoomOut animate__faster',
      },
      customClass: {
        title: `fw-semibold pt-2 text-${type}-1`,
        icon: 'py-4',
        htmlContainer: 'pt-2',
      },
      confirmButtonColor: '#125530',
      showCloseButton,
      showConfirmButton,
      confirmButtonText,
    });
  }

  success(title = '', detailText = '') {
    return this.showAlert({ type: 'success', title, detailText });
  }

  warning(title = '', detailText = '') {
    return this.showAlert({ type: 'warning', title, detailText });
  }

  error(title = '', detailText = '') {
    return this.showAlert({ type: 'error', title, detailText });
  }

  deleteSuccess(title = '', detailText = '') {
    return this.showAlert({ type: 'delete', title, detailText });
  }

  transferSuccess(title = '', detailText = '') {
    return this.showAlert({ type: 'transfer', title, detailText });
  }

  otp(title = '', detailText = '') {
    return this.showAlert({
      type: 'success',
      title,
      detailText,
      showCloseButton: false,
      confirmButtonText: '',
    });
  }
  // Optional generic method
  alert(
    type?: 'success' | 'warning' | 'error' | 'delete' | 'logout' | 'transfer',
    title = '',
    detailText = '',
    options: {
      showCloseButton?: boolean;
      showConfirmButton?: boolean;
      confirmButtonText?: string;
    } = {},
  ) {
    return this.showAlert({ type, title, detailText, ...options });
  }
}
