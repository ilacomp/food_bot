import { Context, Markup, Scenes } from 'telegraf';
import { orderService } from '../utils/order.service';
import { myOrderCommand } from '../commands/order';

async function deleteItem(ctx: Context) {
    const user = ctx.from.username;
    const id = Number((ctx.message as any).text.split('.')[0]);
    try {
        await orderService.deleteFromOrder(user, id - 1);
        const keyboard = await myOrderKeyboard(user);
        await ctx.reply('Удалено. Можешь удалить еще или вернуться /back', keyboard);
    } catch {
        await ctx.reply('Не понял');
    }
}

async function myOrderKeyboard(user: string) {
    const menu = (await orderService.myOrder(user)).map((item, i) => `${i + 1}. ${item.name} x${item.amount}`);
    menu.push('/back');

    return Markup.keyboard(menu).resize();
}

const { leave } = Scenes.Stage;

export const deleteScene = new Scenes.BaseScene<Scenes.SceneContext>('delete');

deleteScene.enter(async (ctx) => {
    const user = ctx.from.username;
    const keyboard = await myOrderKeyboard(user);

    await ctx.reply('Выберите продукт для удаления из вашего заказа', keyboard);
});

deleteScene.leave(async (ctx) => {
    const keyboard = Markup.removeKeyboard();
    await ctx.reply('Удаление окончено', keyboard);
    await myOrderCommand(ctx);
});

deleteScene.command('back', leave<Scenes.SceneContext>());

deleteScene.hears(/\d+/, deleteItem);
