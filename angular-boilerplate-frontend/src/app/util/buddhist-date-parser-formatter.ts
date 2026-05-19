import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

function pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {

    constructor(private i18n: NgbDatepickerI18n) {
        super();
    }


    parse(value: string | null): NgbDateStruct | null {
        if (!value) return null;
        const parts = value.split('-').map(x => parseInt(x, 10));
        if (parts.length === 3 && parts.every(n => !isNaN(n))) {
            return { day: parts[0], month: parts[1], year: parts[2] };
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        if (!date) return '';
        return `${pad(date.day)}-${pad(date.month)}-${date.year}`;
    }
}