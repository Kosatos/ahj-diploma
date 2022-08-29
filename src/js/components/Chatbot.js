export default class Chatbot {
  constructor(botname, data, server) {
    this.botname = botname;
    this.description = `Привет! Меня зовут ${botname}. Если ты заскучал, я помогу тебе выбрать какой-нибудь зарубежный сериал или фильм и даже игру на ПК. Чтобы обратиться ко мне, начни свое сообщение со слэша (/) и напиши одну из команд: "hello", "bye", "serial", "film", "game". Например: "/serial".`;
    this.greeting = data?.greeting;
    this.goodbye = data?.goodbye;
    this.serials = data?.serials;
    this.films = data?.films;
    this.games = data?.games;
    this.server = server;

    this.greet();
  }

  reply(request) {
    if (!/^\//.test(request)) return;
    let message;

    switch (request) {
      case '/hello':
        message = {
          usertype: 'bot',
          botname: this.botname,
          type: 'text',
          content: this.random(this.greeting),
        };
        this.server.send(JSON.stringify(message));
        break;

      case '/bye':
        message = {
          usertype: 'bot',
          botname: this.botname,
          type: 'text',
          content: this.random(this.goodbye),
        };
        this.server.send(JSON.stringify(message));
        break;

      case '/serial':
        message = {
          usertype: 'bot',
          botname: this.botname,
          type: 'text',
          content: this.random(this.serials),
        };
        this.server.send(JSON.stringify(message));
        break;

      case '/film':
        message = {
          usertype: 'bot',
          botname: this.botname,
          type: 'text',
          content: this.random(this.films),
        };
        this.server.send(JSON.stringify(message));
        break;

      case '/game':
        message = {
          usertype: 'bot',
          botname: this.botname,
          type: 'text',
          content: this.random(this.games),
        };
        this.server.send(JSON.stringify(message));
        break;

      default:
        message = {
          usertype: 'bot',
          botname: this.botname,
          type: 'text',
          content:
            'К сожалению, данная команда пока что не доступна мне. Попробуй еще раз написать точнее :)',
        };
        this.server.send(JSON.stringify(message));
    }
  }

  greet() {
    const message = {
      usertype: 'bot',
      botname: this.botname,
      type: 'text',
      content: this.description,
    };
    this.server.send(JSON.stringify(message));
  }

  random(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
