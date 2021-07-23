import { Context } from 'telegraf';
import { nextDate } from '../utils/date';
import { menuService } from '../utils/menu.service';

export async function menuCommand(ctx: Context) {
    const date = nextDate();
    const menu = (await menuService.getMenu()).map((item, i) => `${i + 1}. ${item.name} ${item.price} руб`).join('\n');
    ctx.reply(`Меню на ${date}\n${menu}`);

}
