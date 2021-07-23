import { Context } from 'telegraf';
import { menuService } from '../utils/menu.service';

export async function menuCommand(ctx: Context) {
    const menu = (await menuService.getMenu()).map((item, i) => `${i + 1}. ${item.name} ${item.price} руб`).join('\n');
    ctx.reply(`Меню на ${menuService.menuDate}\n${menu}`);

}
