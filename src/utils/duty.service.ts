import fs from 'fs';
const DUTY_PATH = 'duty';
const DUTY_FILE = DUTY_PATH + '/duty.json';

class DutyService {
    constructor() {
        try {
            fs.mkdirSync(DUTY_PATH, {recursive: true});
        } catch (e) {
        }
    }

    get duties(): string[] {
        return DUTIES;
    }

    nextDuty(): string {
        const currentIndex = DUTIES.indexOf(this.currentDuty);
        const nextIndex = (currentIndex === DUTIES.length - 1) ? 0 : currentIndex + 1;
        fs.writeFileSync(DUTY_FILE, DUTIES[nextIndex], { encoding: 'utf8', flag: 'w+' });
        return DUTIES[nextIndex];
    }

    get currentDuty(): string {
        const file = fs.readFileSync(DUTY_FILE, { encoding: 'utf8', flag: 'a+' });
        return file || '';
    }
}

export interface Duties {
    current: string;
    list: string[];
}

export const dutyService = new DutyService();

export const DUTIES = [
    'Бражник Сергей',
    'Горевы',
    'Зайцева Ольга',
    'Зашкалов Илья',
    'Комаров Сергей',
    'Куликов Илья',
    'Лукьянов Дмитрий',
    'Молочков Дмитрий',
    'Орлов Дмитрий',
    'Орлова Елена',
    'Соколова Дарья',
    'Хлызова Валерья',
    'Юдин Илья',
    'Журавлев Николай',
];
