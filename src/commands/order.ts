import { Context } from 'telegraf';
import { orderService } from '../utils/order.service';

export async function myOrderCommand(ctx: Context) {
    const user = ctx.from.username;
    const myOrder = orderService.myOrder(user);
    const list = myOrder.map((item, i) => `${i + 1}. _${item.name}_ ${item.amount}x*${item.price}* руб`).join('\n');
    const total = myOrder.reduce((sum, item) => sum + item.amount * item.price, 0);
    await ctx.replyWithMarkdown(`*Твой заказ*\n${list}\n======\nИТОГО: *${total} руб*`);
}

export async function ordersCommand(ctx: Context) {
    const order = orderService.orders();
    const list = order.map((item, i) => `- _${item.name}_ ${item.amount}x*${item.price}* руб`).join('\n');
    const total = order.reduce((sum, item) => sum + item.amount * item.price, 0);
    await ctx.replyWithMarkdown(`*Общий заказ*\n${list}\n======\nИТОГО: *${total} руб*`);
}
