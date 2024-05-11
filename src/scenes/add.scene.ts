import { Context, Markup, Scenes } from 'telegraf';
import { orderService } from '../utils/order.service';
import { menuService } from '../utils/menu.service';
import { myOrderCommand } from '../commands/order';

async function addItem(ctx: Context) {
    const user = ctx.from!.username;
    const id = Number((ctx.message as any).text.split('.')[0]);
    try {
        await orderService.addToOrder(user!, id - 1);
        await ctx.reply('Добавлено. Можешь добавить еще или вернуться /back');
    } catch {
        await ctx.reply('Не понял');
    }
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
