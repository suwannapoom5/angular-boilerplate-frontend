import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-block-ui',
  imports: [CommonModule],
  templateUrl: './block-ui.component.html',
  styleUrl: './block-ui.component.scss'
})
export class BlockUiComponent {
  private _blocked = signal(false);
  private _message = signal('');

  @Input() set block(value: boolean) {
    this._blocked.set(value);
  }

  @Input() set blockMessage(val: string) {
    this._message.set(val);
  }

  isBlocked = this._blocked;
  message = this._message;
}
