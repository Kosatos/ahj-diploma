import createMessageBody from '../utils/createMessageBody';

// класс для обработки ботом входящих команд

export default class Chatbot {
  constructor(botname, data, server) {
    this.botname = botname;
    this.description = `Привет! Меня зовут ${botname}. Если ты заскучал, я помогу тебе выбрать какой-нибудь зарубежный сериал или фильм и даже игру на ПК. Чтобы обратиться ко мне, начни свое сообщение со слэша ("/") и напиши одну из команд: "hello", "bye", "serial", "film", "game". Например: "/serial".`;
    this.greeting = data?.greeting;
    this.goodbye = data?.goodbye;
    this.serials = data?.serials;
    this.games = data?.games;
    this.server = server;

    this.greet();
  }

  reply(request) {
    if (!/^\//.test(request)) return;
    let message;

    switch (request) {
      case '/hello':
        message = createMessageBody(
          'bot',
          [{ type: 'text', body: this.random(this.greeting) }],
          this.botname
        );
        this.server.send(message);
        break;

      case '/bye':
        message = createMessageBody(
          'bot',
          [{ type: 'text', body: this.random(this.goodbye) }],
          this.botname
        );
        this.server.send(message);
        break;

      case '/serial':
        message = createMessageBody(
          'bot',
          [{ type: 'text', body: this.random(this.serials) }],
          this.botname
        );
        this.server.send(message);
        break;

      case '/film':
        fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films', {
          method: 'GET',
          headers: {
            'X-API-KEY': '2abdabef-3994-4107-8e8d-39dd2e2edcda',
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((json) => {
            const film = this.random(json.items);
            message = createMessageBody(
              'bot',
              [
                { type: 'text', body: film.nameOriginal },
                { type: 'image', body: film.posterUrlPreview },
              ],
              this.botname
            );
            this.server.send(message);
          })
          .catch((err) => {
            throw new Error(err);
          });

        break;

      case '/game':
        message = createMessageBody(
          'bot',
          [{ type: 'text', body: this.random(this.games) }],
          this.botname
        );
        this.server.send(message);
        break;

      default:
        message = createMessageBody(
          'bot',
          [
            {
              type: 'text',
              body: 'К сожалению, данная команда пока что не доступна мне. Попробуй еще раз написать точнее :)',
            },
          ],
          this.botname
        );

        this.server.send(message);
    }
  }

  greet() {
    const message = {
      greet: true,
      usertype: 'bot',
      botname: this.botname,
      content: [{ type: 'text', body: this.description }],
    };

    this.server.send(JSON.stringify(message));
  }

  random(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
