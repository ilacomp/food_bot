import * as fs from 'fs';
import { MenuItem, menuService } from './menu.service';
import { nextDate } from './date';
const ORDERS_PATH = 'orders';

class OrderService {
    constructor() {
    }

    get ordersPath(): string {
        const path = `${ORDERS_PATH}/${nextDate()}`;
        try {
            fs.mkdirSync(path, {recursive: true});
        } catch (e) {
        }
        return path;
    }

    async addToOrder(user: string, id: number) {
        const menu = await menuService.getMenu();
        const myOrder = this.myOrder(user);
        const item = menu[id];
        if (isNaN(id) || !item) throw new Error();
        const existingItem = myOrder.find(i => i.name === item.name);
        if (existingItem)
            existingItem.amount++;
        else
            myOrder.push({ ...menu[id], amount: 1 });
        fs.writeFileSync(`${this.ordersPath}/${user}.json`, JSON.stringify(myOrder), { encoding: 'utf8', flag: 'w+' });
    }

    async deleteFromOrder(user: string, id: number) {
        const myOrder = this.myOrder(user);
        const item = myOrder[id];
        if (isNaN(id) || !item) throw new Error();

        if (item.amount > 1)
            item.amount--;
        else
            myOrder.splice(id, 1);

        fs.writeFileSync(`${this.ordersPath}/${user}.json`, JSON.stringify(myOrder), { encoding: 'utf8', flag: 'w+' });
    }

    clearMyOrder(user: string) {
        fs.writeFileSync(`${this.ordersPath}/${user}.json`, JSON.stringify([]), { encoding: 'utf8', flag: 'w+' });
    }

    myOrder(user: string): OrderItem[] {
        return this.readOrder(`${user}.json`);
    }

    readOrder(filename: string): OrderItem[] {
        const file = fs.readFileSync(`${this.ordersPath}/${filename}`, { encoding: 'utf8', flag: 'a+' });
        return file ? JSON.parse(file) : [];
    }

    orders(): OrderItem[] {
        const orderFiles = fs.readdirSync(this.ordersPath, { encoding: 'utf8' });
        const order: OrderItem[] = [];
        orderFiles.forEach(filename => {
            const items = this.readOrder(filename);
            items.forEach(item => {
                const existingItem = order.find(i => i.name === item.name);
                if (existingItem)
                    existingItem.amount += item.amount;
                else
                    order.push(item);
            });
        });
        return order;
    }

    totals(): Total[] {
        const orderFiles = fs.readdirSync(this.ordersPath, { encoding: 'utf8' });
        const totals: Total[] = [];
        orderFiles.forEach(filename => {
            const items = this.readOrder(filename);
            const username = filename.split('.json')[0];
            const total = items.reduce((sum, i) => sum + i.amount * i.price, 0);
            if (total) totals.push({ username, total });
        });
        return totals;
    }
}

export const orderService = new OrderService();

export interface OrderItem extends MenuItem {
    amount: number;
}

export interface Total {
    username: string;
    total: number;
}
