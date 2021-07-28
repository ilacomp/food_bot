import { Context } from 'telegraf';
import { dutyService } from '../utils/duty.service';

export async function dutiesCommand(ctx: Context) {
    const duties = dutyService.duties;
    const list = duties.map((item, i) => `${i + 1}. *${item}*`).join('\n');
    await ctx.replyWithMarkdown(`*Список дежурных*\n${list}`);
}

export async function currentDutyCommand(ctx: Context) {
    const currentDuty = dutyService.currentDuty || 'не назначен';
    await ctx.replyWithMarkdown(`*Дежурный*\n${currentDuty}`);
}

export async function nextDutyCommand(ctx: Context) {
    const currentDuty = dutyService.nextDuty();
    await ctx.replyWithMarkdown(`*Новый дежурный*\n${currentDuty}`);
}
