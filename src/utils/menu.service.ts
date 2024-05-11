import { nextDate } from './date';
import axios from 'axios';
import iconv from 'iconv-lite';

class MenuService {
    menuDate: string = '';
    menu: MenuItem[] = [];

    async loadMenu(): Promise<MenuItem[]> {
        this.menuDate = '';
        this.menu = [];
        const date = nextDate();
        try {
            const response = await axios.request({
                url: `http://7slonov.com/menu/?${date}`,
                method: 'GET',
                responseType: 'arraybuffer',
            });
            const data = iconv.decode(Buffer.from(response.data), 'windows-1251');
            const names = [...data.matchAll(/<div class=zagname>([^<]*)<\/div>/g)].map(i => i[1]);
            const prices = [...data.matchAll(/<div class=pr><input type=input [^<]* value="(\d*)" readonly size=4>/g)].map(i => i[1]);
            const menu = names.map((name, i) => ({
                name,
                price: Number(prices[i])
            }));
            this.menuDate = date;
            this.menu = menu;
            return this.menu;
        } catch {
            console.error(`Menu on ${date} not found`);
            return [];
        }
    }

    getMenu(): Promise<MenuItem[]> {
        const date = nextDate();
        return this.menuDate === date && !!this.menu ? Promise.resolve(this.menu) : this.loadMenu();
    }
}

export interface MenuItem {
    name: string;
    price: number;
}

export const menuService = new MenuService();
