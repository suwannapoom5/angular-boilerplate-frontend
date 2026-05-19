import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class BlockUiService {
  private _isGlobalBlocked = signal(false);
  private _globalMessage = signal('');

  isBlocked = this._isGlobalBlocked;
  message = this._globalMessage;

  start(message?: string) {
    this._isGlobalBlocked.set(true);
    if (message) this._globalMessage.set(message);
    document.body.style.overflow = 'hidden';
  }

  stop() {
    this._isGlobalBlocked.set(false);
    document.body.style.overflow = '';
  }
}