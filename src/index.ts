import { Telegraf, session, Scenes } from 'telegraf';
import { config } from 'dotenv';
import { menuCommand } from './commands/menu';
import { addScene, myOrderCommand, ordersCommand } from './commands/order';

config();

const stage = new Scenes.Stage<Scenes.SceneContext>([
    addScene
]);

const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_TOKEN);
bot.start(ctx => {
    ctx.reply('Ну привет, епта');
});
bot.use(session());
bot.use(stage.middleware());
bot.command('menu', menuCommand);
bot.command('myorder', myOrderCommand);
bot.command('orders', ordersCommand);
bot.command('add', (ctx) => ctx.scene.enter('add'));


bot.launch()
    .then(() => {
        bot.telegram.setMyCommands([
            {command: 'start', description: 'Начать разговор'},
            {command: 'menu', description: 'Меню'},
            {command: 'myorder', description: 'Мой заказ'},
            {command: 'orders', description: 'Заказы'},
            {command: 'add', description: 'Добавить продукт'},
        ]);
        console.info('Bot was started');
    })
    .catch( error => console.error('Error starting bot', error));
