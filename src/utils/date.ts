import { addDays, format, isWeekend, nextMonday } from 'date-fns';
export function nextDate(): string {
    let next = addDays(new Date(), 1);
    if (isWeekend(next)) next = nextMonday(next);
    return format(next, 'dd.MM.yyyy');
}
