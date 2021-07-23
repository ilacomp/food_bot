import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { menuCommand } from './commands/menu';
import { myOrderCommand, ordersCommand } from './commands/order';

config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(ctx => {
    ctx.reply('Ну привет, епта');
});

bot.command('menu', menuCommand);
bot.command('myorder', myOrderCommand);
bot.command('orders', ordersCommand);


bot.launch()
    .then(() => {
        bot.telegram.setMyCommands([
            {command: 'start', description: 'Начать разговор'},
            {command: 'menu', description: 'Меню'},
            {command: 'myorder', description: 'Мой заказ'},
            {command: 'orders', description: 'Заказы'},
        ]);
        console.info('Bot was started');
    })
    .catch( error => console.error('Error starting bot', error));
