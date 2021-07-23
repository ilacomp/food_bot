import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import axios from 'axios';
import { menuCommand } from './commands/menu';

config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(ctx => {
    ctx.reply('Ну привет, епта');
});

bot.command('menu', menuCommand);


bot.launch()
    .then(() => {
        bot.telegram.setMyCommands([
            {command: 'start', description: 'Начать разговор'},
            {command: 'menu', description: 'Меню'},
        ]);
        console.info('Bot was started');
    })
    .catch( error => console.error('Error starting bot', error));
