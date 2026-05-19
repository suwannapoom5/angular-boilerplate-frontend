import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Injectable,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDatepickerModule,
  NgbDatepickerNavigateEvent,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

import { TablerIcon } from '../tabler-icon/tabler-icon-list';
import { TablerIconComponent } from '../tabler-icon/tabler-icon.component';

@Injectable({ providedIn: 'root' })
export class NgbMomentISOAdapter extends NgbDateAdapter<string> {
  fromModel(date: string | null): NgbDateStruct | null {
    if (!date) return null;
    const m = moment(date, 'YYYY-MM-DD', true);
    if (!m.isValid()) return null;
    return { year: m.year(), month: m.month() + 1, day: m.date() };
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    const m = moment({ year: date.year, month: date.month - 1, day: date.day });
    // const m = moment.utc({ year: date.year, month: date.month - 1, day: date.day }).toISOString();
    return m.format('YYYY-MM-DD');
  }
}

export interface IMonthPicker {
  year: number | null,
  month: number | null
}


@Component({
  selector: 'app-date-picker',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    TablerIconComponent,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
    { provide: NgbDateAdapter, useClass: NgbMomentISOAdapter },
    // 2. Register the component as a validator
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent {
  display = '';
  temp_display = '';

  value!: string | null; // for single mode

  @Output() startChange = new EventEmitter<string | null>();
  @Output() endChange = new EventEmitter<string | null>();

  @Output() startMonthChange = new EventEmitter<IMonthPicker | null>();
  @Output() endMonthChange = new EventEmitter<IMonthPicker | null>();

  display_start = '';
  display_end = '';

  @Input() startValue: string | null = null; // for range mode
  @Input() endValue: string | null = null; // for range mode

  rangeStart: NgbDateStruct | null = null;
  rangeEnd: NgbDateStruct | null = null;

  hoveredDate: any;

  isInitValue: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() showRequireSymbold: boolean = true;
  @Input() errorValidate!: boolean;
  @Input() dpClass: string = '';

  @Input() endByToday = false;
  todayStruct!: NgbDateStruct;
  startDayStruct!: NgbDateStruct;

  @Input() isRange: boolean = false;
  @Input() isMonthRange: boolean = false;
  @Input() isYearRange: boolean = false;

  fromStartMonth = {
    year: new Date().getFullYear() + 543,
    month: new Date().getMonth() + 1,
  };
  toEndMonth = {
    year: new Date().getFullYear() + 543,
    month: new Date().getMonth() + 1,
  };
  isRangeInvalid: boolean = false;

  isTouched: boolean = false;

  @Input() labelText: string = '';
  @Input() requiredText: string = 'กรุณาระบุวันที่';

  @Input() disabled_date_list: NgbDateStruct[] = [];

  @Input() disable_weekend: boolean = false;
  @Input() isDisabledCalender: boolean = true;

  date_to_disabled = (date: NgbDate): boolean => {
    return (
      (this.disable_weekend ? this.calendar.getWeekday(date) >= 6 : false) ||
      this.disabled_date_list.some(
        (d) =>
          d.year + 543 === date.year &&
          d.month === date.month &&
          d.day === date.day
      )
    );
  };

  @Input() date_format: string = 'DD-MM-YYYY';

  _TablerIcon = TablerIcon;

  onChange = (
    _: string | { start: string | null; end: string | null } | null
  ) => { };
  onTouched = () => { };

  constructor(
    private ngbDateAdapter: NgbDateAdapter<string>,
    private calendar: NgbCalendar,
    private cdr: ChangeDetectorRef
  ) {
    const t: NgbDate = this.calendar.getToday(); // NgbDate
    this.todayStruct = { year: t.year, month: t.month, day: t.day }; // -> NgbDateStruct
    this.startDayStruct = { year: t.year - 100, month: t.month, day: t.day }; // -> NgbDateStruct
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isRange && (changes['startValue'] || changes['endValue'])) {
      if (this.startValue) {
        const start = moment(this.startValue);
        if (start.isValid()) {
          this.fromDate = new NgbDate(
            start.year() + 543,
            start.month() + 1,
            start.date()
          );
        }
      } else {
        this.fromDate = null;
      }

      if (this.endValue) {
        const end = moment(this.endValue);
        if (end.isValid()) {
          this.toDate = new NgbDate(
            end.year() + 543,
            end.month() + 1,
            end.date()
          );
        }
      } else {
        this.toDate = null;
      }

      this.display = `${this.startValue
        ? moment(this.startValue).add(543, 'years').format(this.date_format)
        : ' วว-ดด-ปปปป'
        } - ${this.endValue
          ? moment(this.endValue).add(543, 'years').format(this.date_format)
          : ' วว-ดด-ปปปป'
        }`;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required) {
      if (this.isRange && (!this.startValue || !this.endValue)) {
        return { required: true };
      }
      if (!this.isRange && !this.value) {
        return { required: true };
      }
    }
    return null;
  }

  private parseToAd(val: string): moment.Moment | null {
    // รองรับ ISO และ DD-MM-YYYY (ใส่ format ตามที่ระบบคุณส่งมา)
    const m = moment(val, [moment.ISO_8601, 'DD-MM-YYYY', 'YYYY-MM-DD'], true);
    if (!m.isValid()) return null;

    // ถ้าปีที่รับเข้ามาเป็น BE (>=2400) ให้แปลงกลับเป็น AD
    // if (m.year() >= 2400) m.subtract(543, 'years');

    return m;
  }

  writeValue(val: string | null): void {
    if (!val) {
      this.display = '';
      this.temp_display = '';
      this.value = null;
      this.startValue = null;
      this.endValue = null;
      return;
    }

    if (this.isRange) {
      const [startRaw, endRaw] = val.split(' - ');

      const startAd = startRaw ? this.parseToAd(startRaw) : null;
      const endAd = endRaw ? this.parseToAd(endRaw) : null;
      if (!startAd || !endAd) {
        this.display = '';
        this.startValue = null;
        this.endValue = null;
        return;
      }

      // เก็บค่า AD จริง
      this.startValue = startAd.startOf('day').toISOString();
      this.endValue = endAd.endOf('day').toISOString();

      // แสดงผล BE
      const startBe = startAd.clone().add(543, 'years');
      const endBe = endAd.clone().add(543, 'years');
      this.display = `${startBe.format(this.date_format)} - ${endBe.format(this.date_format)}`;
      return;
    }

    const ad = this.parseToAd(val);
    if (!ad) {
      this.display = '';
      this.temp_display = '';
      this.value = null;
      return;
    }

    // เก็บค่า AD จริง
    this.value = ad.endOf('day').toISOString();

    // แสดงผล BE
    const be = ad.clone().add(543, 'years');
    this.temp_display = be.format(this.date_format);
    this.display = be.format('YYYY-MM-DD');

    console.log('writevalue')
    queueMicrotask(() => this.cdr.detectChanges());
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleCalendar(d: any) {
    if (this.readonly || this.isDisabled) {
      return;
    }

    this.isTouched = true;
    d.onFocus();
    d.toggle();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChanged(val: string | null) {
    console.log(val)

    let date = moment(val)
      .subtract(543, 'years')
      .endOf('day')
      .format('YYYY-MM-DD');

    this.value = date;


    const christianYear = moment(val)
      .subtract(543, 'years')
      .endOf('day')
      .format('YYYY');



    this.onChange(this.value);
    this.onTouched();
    queueMicrotask(() => this.cdr.detectChanges());

    const buddhistYear = (Number(christianYear) + 543).toString();

    this.temp_display = moment(val)
      .subtract(543, 'years')
      .format(
        this.date_format
          .replace('YYYY', buddhistYear)
          .replace('YY', buddhistYear.substring(2, 4))
      )
      .replace(christianYear, buddhistYear);

    queueMicrotask(() => this.cdr.detectChanges());
    console.log('onChanged')
    // this.cdr.detectChanges()
  }


  onRangeDateChange(date: NgbDate): void {
    const isoString = this.ngbDateAdapter.toModel(date);
    const momentDate = moment(isoString).subtract(543, 'years');

    if (!this.fromDate && !this.toDate) {
      this.setFromDate(date, momentDate.startOf('day'));
      this.toDate = null;
      this.endValue = null;
    } else if (this.fromDate && !this.toDate) {
      if (date.equals(this.fromDate)) {
        this.setToDate(date, momentDate.endOf('day'));
      } else if (date.after(this.fromDate)) {
        this.setToDate(date, momentDate.endOf('day'));
      } else {
        this.setFromDate(date, momentDate.startOf('day'));
        this.toDate = null;
        this.endValue = null;
      }
    } else {
      this.setFromDate(date, momentDate.startOf('day'));
      this.toDate = null;
      this.endValue = null;
    }

    this.display = `${this.formatDisplayDate(
      this.fromDate
    )} - ${this.formatDisplayDate(this.toDate)}`;
    this.onTouched();
    this.startChange.emit(this.startValue);
    this.endChange.emit(this.endValue);
  }

  private setFromDate(date: NgbDate, momentValue: moment.Moment): void {
    this.fromDate = date;
    this.startValue = momentValue.toISOString();
  }

  private setToDate(date: NgbDate, momentValue: moment.Moment): void {
    this.toDate = date;
    this.endValue = momentValue.toISOString();
  }

  private formatDisplayDate(date: NgbDate | null): string {
    if (!date) return 'วว-ดด-ปปปป';
    const iso = this.ngbDateAdapter.toModel(date);
    return moment(iso).format(this.date_format);
  }

  protected fromDate: NgbDate | null = null;
  protected toDate: NgbDate | null = null;

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isValueRange(date: NgbDate) {
    if (!this.fromDate && !this.toDate) return false;

    if (this.fromDate && this.toDate && this.fromDate.equals(this.toDate)) {
      return date.equals(this.fromDate);
    }

    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onDisplayChange(value: string) {
    if (!value || value.trim() === '') {
      this.fromDate = null;
      this.toDate = null;
      this.startValue = null;
      this.endValue = null;
      this.display = '';
      return;
    }

    const parts = value.split('-').map((p) => p.trim());
    const startText: string = parts[0] || '';
    const endText: string = parts[1] || '';

    if (!startText || startText.length < 10) {
      this.fromDate = null;
      this.toDate = null;
      this.startValue = null;
      this.endValue = null;
      this.display = '';
      return;
    }

    if (!endText) {
      this.toDate = null;
      this.endValue = null;
      this.display = `${startText} - วว-ดด-ปปปป`;
    } else {
      this.display = `${startText} - ${endText}`;
    }
  }

  onMonthSelect(event: NgbDatepickerNavigateEvent, type: 'from' | 'to') {
    if (type === 'from') {
      this.fromStartMonth = event.next;
      this.startMonthChange.emit(this.fromStartMonth);
    } else {
      this.toEndMonth = event.next;
      this.endMonthChange.emit(this.toEndMonth);
    }

    if (
      this.fromStartMonth &&
      this.fromStartMonth.year &&
      this.toEndMonth &&
      this.toEndMonth.year
    ) {
      this.validateDateRange();
    }
  }

  validateDateRange() {
    const fromValue = this.fromStartMonth.year * 12 + this.fromStartMonth.month;
    const toValue = this.toEndMonth.year * 12 + this.toEndMonth.month;

    this.isRangeInvalid = fromValue > toValue;
  }
}
