import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class BuddhistDateAdapter extends NgbDateAdapter<string | null> {
    fromModel(value: string | null): NgbDateStruct | null {
        if (!value) return null;

        const parts = value.split('-');
        if (parts.length !== 3) return null;

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (!year || !month || !day) return null;

        return {
            year: year - 543, // BE -> AD
            month,
            day
        };
    }

    toModel(date: NgbDateStruct | null): string | null {
        if (!date) return null;

        const year = date.year + 543; // AD -> BE
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}