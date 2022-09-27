import textfilter from '../utils/textfilter';
import element from '../utils/element';
import icons from './icons';

// класс для обработки входящих с сервера сообщений по содержимому контенту, взаимодействие с закреплением и добавлением в избранное

export default class Message {
  constructor(data, server) {
    this.server = server;
    this.id = data.id;
    this.usertype = data.usertype;
    this.username = data.username;
    this.date = new Date(data.date);
    this.content = data.content;
    this.favorite = data.favorite;
    this.pinned = data.pinned;
  }

  render() {
    this.messageEl = element('li', 'messanger__message message-messanger');
    this.messageEl.classList.add(
      this.usertype === 'bot' ? 'bot-message' : 'user-message'
    );
    this.messageEl.dataset.id = this.id;

    this.messageInfoEl = element('div', 'message-messanger__info');
    this.messageAuthorEl = element(
      'span',
      'message-messanger__author',
      this.usertype !== 'bot' ? 'You' : this.username
    );
    this.messageDateEl = element(
      'span',
      'message-messanger__date',
      this.formatDate(this.date)
    );
    this.messageInfoEl.appendChild(this.messageAuthorEl);
    this.messageInfoEl.appendChild(this.messageDateEl);

    this.messageContentEl = element(
      'div',
      'message-messanger__content content'
    );
    this.contentMediaEl = element('div', 'content__media');
    this.mediaImagesEl = element('div', 'content__images');
    this.checkType(
      this.messageContentEl,
      this.contentMediaEl,
      this.mediaImagesEl
    );
    this.messageEl.appendChild(this.messageInfoEl);
    this.messageEl.appendChild(this.messageContentEl);
    this.messageContentEl.appendChild(this.contentMediaEl);
    this.contentMediaEl.appendChild(this.mediaImagesEl);

    this.messagesControllers = element(
      'div',
      'message-messanger__controllers message-controllers'
    );
    this.pinBtn = element('button', 'message-controllers__pin messanger-btn');
    this.favoriteBtn = element(
      'button',
      'message-controllers__favorite messanger-btn'
    );
    if (this.favorite) {
      this.favoriteBtn.classList.add('added');
    }
    this.messagesControllers.appendChild(this.pinBtn);
    this.messagesControllers.appendChild(this.favoriteBtn);

    this.pinBtn.addEventListener('click', () => this.pin());
    this.favoriteBtn.addEventListener('click', () => this.addToFavorite());

    this.messageEl.appendChild(this.messagesControllers);
    ``;
    return this.messageEl;
  }

  checkType(contentEl, mediaEl, mediaImages) {
    this.content.forEach((el) => {
      switch (el.type) {
        case 'text':
          const textEl = element('span', 'content__text');
          textEl.innerHTML = textfilter(el.body);
          contentEl.appendChild(textEl);
          break;
        case 'video':
          const videoWrapper = element('div', 'content__video');
          const videoEl = element('video');
          videoEl.src = el.body;
          videoEl.controls = true;
          videoWrapper.appendChild(videoEl);
          const videoLoader = element(
            'a',
            'content__download-btn messanger-btn'
          );
          videoLoader.href = el.body;
          videoLoader.download = el.filename;
          videoWrapper.appendChild(videoLoader);
          mediaEl.appendChild(videoWrapper);
          break;
        case 'audio':
          const audioWrapper = element('div', 'content__audio');
          const audioTitle = element(
            'span',
            'content__audio-name',
            el.filename
          );
          audioWrapper.appendChild(audioTitle);
          const audioEl = element('audio');
          audioEl.src = el.body;
          audioEl.controls = 'true';
          audioWrapper.appendChild(audioEl);
          const audioLoader = element(
            'a',
            'content__download-btn messanger-btn'
          );
          audioLoader.href = el.body;
          audioLoader.download = el.filename;
          audioWrapper.appendChild(audioLoader);
          mediaEl.appendChild(audioWrapper);
          break;
        case 'location':
          const locationEl = element('span', 'content__location');
          locationEl.innerHTML = `📍 Your current location - <a href="https://www.google.com/maps/search/?api=1&query=${el.body}" target="_blank">${el.body}</a>`;
          contentEl.appendChild(locationEl);
          break;
        case 'image':
          const imageWrapper = element('div', 'content__image');
          const imageEl = element('img');
          imageWrapper.appendChild(imageEl);
          imageEl.src = el.body;
          const imgLoader = element('a', 'content__download-btn messanger-btn');
          imgLoader.href = el.body;
          imgLoader.download = el.filename;
          imageWrapper.appendChild(imgLoader);
          mediaImages.appendChild(imageWrapper);
          break;
        default:
          const fileWrapper = element('div', 'content__file');
          const fileEl = element('img')
          fileEl.src = icons.file;
          fileWrapper.appendChild(fileEl);
          const fileTitle = element('span', 'content__file-name', el.filename);
          fileWrapper.appendChild(fileTitle);
          const fileLoader = element('a', 'content__download-btn messanger-btn');
          fileLoader.href = el.body;
          fileLoader.download = el.filename;
          fileWrapper.appendChild(fileLoader); 
          contentEl.appendChild(fileWrapper);
          return;
      }
    });
  }

  addToFavorite() {
    if (this.favorite) {
      this.favorite = false;
      this.favoriteBtn.classList.remove('added');
    } else {
      this.favorite = true;
      this.favoriteBtn.classList.add('added');
    }
    this.server.send(
      JSON.stringify({
        addToFavorite: true,
        favorite: this.favorite,
        id: this.messageEl.dataset.id,
      })
    );
  }

  pin() {
    this.pinned = true;
    this.server.send(
      JSON.stringify({
        pinMessage: true,
        pinned: this.pinned,
        id: this.messageEl.dataset.id,
      })
    );
  }

  formatDate(date) {
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minute =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const formattedDate = `${hour}:${minute}`;

    return formattedDate;
  }
}
