import resize from './resize';

// отправка сообщения боту

export default function sendMessage(server, messageBody, bot, form, input) {
  server.send(messageBody);
  const messageToBot = JSON.parse(messageBody).content.find(
    (cnt) => cnt.type === 'text'
  );
  bot.reply(messageToBot.body);
  form.reset();
  resize(input, '50px');
}
