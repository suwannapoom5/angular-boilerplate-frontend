import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private titleSubject = new BehaviorSubject<string>('Page Title');
  private subTitleSubject = new BehaviorSubject<string>('Page Sub Title');

  constructor(private titleService: Title) {

  }

  title$ = this.titleSubject.asObservable();
  subTitle$ = this.subTitleSubject.asObservable();


  setTitle(title: string) {
    this.titleSubject.next(title);
  }

  setSubTitle(subTitle: string) {
    this.subTitleSubject.next(subTitle);
  }

  setHeader(title: string, subTitle: string) {
    this.titleSubject.next(title);
    this.subTitleSubject.next(subTitle);
  }
}
