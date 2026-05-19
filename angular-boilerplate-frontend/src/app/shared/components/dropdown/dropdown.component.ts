import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { ScreenService } from '../../../core/services/helper/screen.service';
import { TablerIcon } from '../tabler-icon/tabler-icon-list';
import { TablerIconComponent } from '../tabler-icon/tabler-icon.component';


@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, TablerIconComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent implements OnDestroy {
  isMobile$!: Observable<boolean>;
  isTablet$!: Observable<boolean>;
  isPc$!: Observable<boolean>;

  isNotiMobileDetailOpen: boolean = false;
  @Input() thumbnailData: any

  private static activeDropdown: DropdownComponent | null = null;

  _TablerIcon = TablerIcon

  @Input() iconName: string = TablerIcon.DotsVertical;

  public activeMenu: HTMLElement | null = null;

  private scrollListener!: () => void;
  private resizeListener!: () => void;

  private subscriptions: Subscription[] = [];

  constructor(private elementRef: ElementRef, private screenService: ScreenService) {
    this.isMobile$ = this.screenService.isMobile$();
    this.isTablet$ = this.screenService.isTablet$();
    this.isPc$ = this.screenService.isPc$();
  }

  initClearStateResponsive() {
    this.subscriptions.push(
      this.isMobile$.subscribe(isMobile => {
        this.isNotiMobileDetailOpen = false;
      }),
      this.isTablet$.subscribe(isTablet => {
        this.isNotiMobileDetailOpen = false;
      }),
      this.isPc$.subscribe(isPc => {
        this.isNotiMobileDetailOpen = false;
      })
    );
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (DropdownComponent.activeDropdown && !DropdownComponent.activeDropdown.elementRef.nativeElement.contains(event.target)) {
      DropdownComponent.activeDropdown.closeActiveMenu();
    }
  }

  toggleDropdown(event: MouseEvent, menu: HTMLElement) {
    event.stopPropagation();
    const trigger = event.currentTarget as HTMLElement;

    if (this.activeMenu === menu) {
      this.closeActiveMenu();
    } else {
      this.openMenu(menu, trigger);
    }
  }

  openMenu(menu: HTMLElement, trigger: HTMLElement) {
    if (DropdownComponent.activeDropdown && DropdownComponent.activeDropdown !== this) {
      DropdownComponent.activeDropdown.closeActiveMenu();
    }

    setTimeout(() => {
      this.activeMenu = menu;
      menu.classList.add('show');
      DropdownComponent.activeDropdown = this;

      const reposition = () => {
        const triggerRect = trigger.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;
        const offset = 8;

        // --- FLIP LOGIC ---
        let top;

        if (triggerRect.bottom + menuHeight + offset > window.innerHeight) {
          top = triggerRect.top - menuHeight - offset;
        } else {
          top = triggerRect.bottom + offset;
        }
        // --- END OF FLIP LOGIC ---

        const left = triggerRect.right - menu.offsetWidth;

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
      };

      this.scrollListener = reposition;
      this.resizeListener = reposition;

      document.addEventListener('scroll', this.scrollListener, true);
      window.addEventListener('resize', this.resizeListener);

      reposition();
    }, 10);
  }
  closeActiveMenu() {
    if (this.activeMenu) {
      this.activeMenu.classList.remove('show');
      this.activeMenu = null;

      if (DropdownComponent.activeDropdown === this) {
        DropdownComponent.activeDropdown = null;
      }

      if (this.scrollListener) {
        document.removeEventListener('scroll', this.scrollListener, true);
      }
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
      }
    }
  }

  ngOnDestroy(): void {
    this.closeActiveMenu();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleNotiMobileDetailcanvas(data?: any): void {
    this.isNotiMobileDetailOpen = !this.isNotiMobileDetailOpen;

    if (data) {
      this.thumbnailData = data
    } else {
      this.thumbnailData = null
    }
  }
}