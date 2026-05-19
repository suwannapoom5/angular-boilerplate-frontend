import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class CalendarService {
    toBuddhistYear(adYear: number): number {
        return adYear + 543;
    }

    toAnnoDominiYear(beYear: number): number {
        return beYear - 543;
    }

    toApiDate(date: NgbDateStruct | null): string | null {
        if (!date) return null;
        const y = String(date.year).padStart(4, '0');
        const m = String(date.month).padStart(2, '0');
        const d = String(date.day).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    fromApiDate(value: string | null): NgbDateStruct | null {
        if (!value) return null;
        const parts = value.split('-');
        if (parts.length !== 3) return null;

        return {
            year: Number(parts[0]),
            month: Number(parts[1]),
            day: Number(parts[2])
        };
    }

    formatBeDisplayFromStruct(date: NgbDateStruct | null): string {
        if (!date) return '';
        const d = String(date.day).padStart(2, '0');
        const m = String(date.month).padStart(2, '0');
        const y = date.year + 543;
        return `${d}/${m}/${y}`;
    }

    beStringToApiDate(value: string | null): string | null {
        if (!value) return null;
        const parts = value.split('-');
        if (parts.length !== 3) return null;

        const beYear = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        return `${beYear - 543}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
}