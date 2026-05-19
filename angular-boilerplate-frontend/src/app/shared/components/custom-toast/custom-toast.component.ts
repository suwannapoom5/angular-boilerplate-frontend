import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { TablerIconComponent } from '../tabler-icon/tabler-icon.component';

@Component({
  selector: 'app-custom-toast',
  imports: [CommonModule, TablerIconComponent],
  templateUrl: './custom-toast.component.html',
  styleUrl: './custom-toast.component.scss'
})
export class CustomToastComponent extends Toast {
  icon = 'Bell';
  typeClass = '';

  constructor(
    toastr: ToastrService,
    toastPackage: ToastPackage
  ) {
    super(toastr, toastPackage);

    const data = (toastPackage.toastType === 'custom'
      ? toastPackage.config.payload
      : toastPackage.config.payload) as any | undefined;

    if (data?.icon) this.icon = data.icon;

    const type = (data?.css_class || '').toLowerCase().trim();

    let temp_type = ''

    if (type == 'primary') {
      temp_type = 'info'
    } else {
      temp_type = type
    }
    this.typeClass = type ? `noti-toast-${temp_type}` : '';
  }
}
