import { Context } from 'telegraf';
import { orderService } from '../utils/order.service';

export async function myOrderCommand(ctx: Context) {
    const user = ctx.from!.username;
    const myOrder = orderService.myOrder(user!);
    const list = myOrder.map((item, i) => `${i + 1}. _${item.name}_ ${item.amount}x*${item.price}* руб`).join('\n');
    const total = myOrder.reduce((sum, item) => sum + item.amount * item.price, 0);
    await ctx.replyWithMarkdown(`*Твой заказ*\n${list}\n======\nИТОГО: *${total} руб*`);
}

export async function ordersCommand(ctx: Context) {
    const order = orderService.orders();
    const list = order.map(item => `- _${item.name}_ ${item.amount}x*${item.price}* руб`).join('\n');
    const total = order.reduce((sum, item) => sum + item.amount * item.price, 0);
    await ctx.replyWithMarkdown(`*Общий заказ*\n${list}\n======\nИТОГО: *${total} руб*`);
}

export async function clearOrderCommand(ctx: Context) {
    const user = ctx.from!.username;
    orderService.clearMyOrder(user!);
    await myOrderCommand(ctx);
}

export async function totalsCommand(ctx: Context) {
    const totals = orderService.totals();
    const list = totals.map(item => `@${item.username} ${item.total} руб`).join('\n');
    await ctx.replyWithMarkdown(`*Подведем итоги*`);
    if (list.length) await ctx.reply(list);
    else await ctx.reply('Заказов нет');
}
