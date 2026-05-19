import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScreenService {
  constructor(private breakpointObserver: BreakpointObserver) { }

  /** < 768px */
  isMobile$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(max-width: 767.98px)'])
      .pipe(map(result => result.matches));
  }

  /** 768px - 991.98px */
  isTablet$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(min-width: 768px) and (max-width: 991.98px)'])
      .pipe(map(result => result.matches));
  }

  /** ≥ 992px */
  isPc$(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(min-width: 992px)'])
      .pipe(map(result => result.matches));
  }

}
