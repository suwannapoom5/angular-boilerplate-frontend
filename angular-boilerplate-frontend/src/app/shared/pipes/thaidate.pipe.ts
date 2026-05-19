import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

import 'moment/locale/th'

@Pipe({
    name: 'thaidate',
})
export class ThaidatePipe implements PipeTransform {
    transform(date: any, format: string = 'D MMM YYYY'): string {
        const momentdate = moment(date);
        
        if (!momentdate.isValid()) {
            return "";
        }

        const christianYear = momentdate.format('YYYY');
        const buddhistYear = (Number(christianYear) + 543).toString();
        return momentdate
            .format(format.replace('YYYY', buddhistYear).replace('YY', buddhistYear.substring(2, 4)))
            .replace(christianYear, buddhistYear);
    }
}
