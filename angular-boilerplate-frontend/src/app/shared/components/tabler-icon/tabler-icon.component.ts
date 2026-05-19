import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TablerIcon } from './tabler-icon-list';


@Component({
  selector: 'app-tabler-icon',
  imports: [CommonModule, TablerIconsModule],
  templateUrl: './tabler-icon.component.html',
  styleUrl: './tabler-icon.component.scss'
})
export class TablerIconComponent {
  @Input() name: TablerIcon | string | null = null;
  @Input() fill: boolean = false;

  @Input() strokeWidth: number = 1; // Default Tabler stroke-width
  @Input() size: number = 24;
  @Input() color?: string;
  @Input() fillColor?: string;

  @Input() iconClass?: string;

  /**
   * Appends '-filled' to the icon name if the fill property is true.
   */
  get iconName(): string {
    return this.fill ? `${this.name}-filled` : (this.name || '');
  }

  /**
   * Generates the style map, primarily for applying color.
   */
  get styleMap(): { [key: string]: string } {
    let result: any = {
      color: this.color ?? 'inherit',
      width: `${this.size}px`,
      height: `${this.size}px`,

      'stroke-width': `${this.strokeWidth}`,
    };

    if (this.fillColor) {
      result = {
        ...result,
        fill: this.fillColor ?? 'inherit',
      }
    }
    
    return result
  }
}
