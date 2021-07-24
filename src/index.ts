import { Telegraf, session, Scenes } from 'telegraf';
import { config } from 'dotenv';
import { menuCommand } from './commands/menu';
import { clearOrderCommand, myOrderCommand, ordersCommand, totalsCommand } from './commands/order';
import { addScene } from './scenes/add.scene';
import { deleteScene } from './scenes/delete.scene';

config();

const stage = new Scenes.Stage<Scenes.SceneContext>([addScene, deleteScene]);

const bot = new Telegraf<Scenes.SceneContext>(process.env.TELEGRAM_TOKEN);
bot.start(ctx => {
    ctx.reply('Привет. Тут можно посмотреть меню, сделать заказ и собрать все заказы в один');
});
bot.use(session());
bot.use(stage.middleware());
bot.command('menu', menuCommand);
bot.command('myorder', myOrderCommand);
bot.command('orders', ordersCommand);
bot.command('add', (ctx) => ctx.scene.enter('add'));
bot.command('delete', (ctx) => ctx.scene.enter('delete'));
bot.command('clearorder', clearOrderCommand);
bot.command('totals', totalsCommand);


bot.launch()
    .then(() => {
        bot.telegram.setMyCommands([
            {command: 'start', description: 'Начать разговор'},
            {command: 'menu', description: 'Меню'},
            {command: 'myorder', description: 'Мой заказ'},
            {command: 'orders', description: 'Заказы'},
            {command: 'add', description: 'Добавить продукт'},
            {command: 'delete', description: 'Удалить продукт'},
            {command: 'clearorder', description: 'Очистить мой заказ'},
            {command: 'totals', description: 'Список сумм'},
        ]);
        console.info('Bot was started');
    })
    .catch( error => console.error('Error starting bot', error));
