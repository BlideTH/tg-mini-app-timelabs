import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';

const token = '7554393961:AAHBhyKtw6J_vGpGA6sEpa9RdxRgCg9fc4s'; // Replace with your actual bot token
const webAppUrl = 'https://timelabs-payments-app.web.app/';
const groupId = '-1002465282001'; // Replace with your group ID where you want to receive feedback

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
  ctx.reply(
    'Добро пожаловать! Нажмите на кнопку Магазин, чтобы запустить приложение. Нажмите на кнопку Обратная связь, чтобы связаться с нами',
    Markup.inlineKeyboard([
      Markup.button.webApp('Обратная связь', webAppUrl + '/feedback'),
    ]),    
  );
});

// Handle feedback from the WebApp
bot.on(message('web_app_data'), async (ctx) => {
  console.log('Received web_app_data:', ctx.message.web_app_data); // Debugging log to verify bot received data
  try {
    const data = JSON.parse(ctx.message.web_app_data.data); // Assuming the data is JSON formatted
    const feedback = data.feedback || 'Empty message';
    const userId = ctx.message.from.id; // Get the user's Telegram ID
    const userName = ctx.message.from.username ? `@${ctx.message.from.username}` : ctx.message.from.first_name;

    // Prepare feedback message
    const feedbackMessage = `
Новое сообщение от пользователя: ${userName} (ID: ${userId})
Сообщение: ${feedback}
    `;

    // Send feedback to the group chat
    await ctx.telegram.sendMessage(groupId, feedbackMessage);
    console.log('Message sent to group:', feedbackMessage); // Log to verify the message is being sent

    // Confirm to the user that their feedback was received
    ctx.reply('Ваше сообщение было отправлено. Спасибо за ваш отзыв!');
  } catch (error) {
    console.error('Error sending message to group:', error);
    ctx.reply('Ошибка при отправке вашего сообщения. Пожалуйста, попробуйте снова.');
  }
});

bot.launch().then(() => {
  console.log('Bot is successfully connected and running'); // Debugging log for bot launch
}).catch((error) => {
  console.error('Bot failed to launch:', error); // Log any error if bot fails to start
});
