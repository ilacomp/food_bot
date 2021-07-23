import { Context, Markup, Scenes } from 'telegraf';
import { orderService } from '../utils/order.service';
import { menuService } from '../utils/menu.service';

export async function myOrderCommand(ctx: Context) {
    const user = ctx.from.username;
    const myOrder = orderService.myOrder(user);
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

async function addItem(ctx: Context) {
    const user = ctx.from.username;
    const id = Number((ctx.message as any).text.split('.')[0]);
    await orderService.addToOrder(user, id - 1);
    await ctx.reply('Добавлено. Можешь добавить еще. Или вернуться /back');
}

const { leave } = Scenes.Stage;

export const addScene = new Scenes.BaseScene<Scenes.SceneContext>('add');

addScene.enter(async (ctx) => {
    const menu = (await menuService.getMenu()).map((item, i) => `${i + 1}. ${item.name}`);
    menu.push('/back');

    const keyboard = Markup.keyboard(menu).resize();

    await ctx.reply('Выберите продукт', keyboard);
});

addScene.leave(async (ctx) => {
    const keyboard = Markup.removeKeyboard();
    await ctx.reply('Добавление окончено', keyboard);
    await myOrderCommand(ctx);
});

addScene.command('back', leave<Scenes.SceneContext>());

addScene.hears(/\d+/, addItem);
