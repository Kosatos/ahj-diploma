import textfilter from '../utils/textfilter';

export default class Message {
  constructor(data) {
    this.usertype = data.usertype;
    this.username = data.username;
    this.date = new Date(data.date);
    this.type = data.type;
    this.content = data.content;
  }

  render() {
    this.messageEl = document.createElement('li');
    this.messageEl.className =
      this.usertype === 'bot'
        ? 'messanger__message message-messanger bot-message'
        : 'messanger__message message-messanger user-message';

    this.messageInfoEl = document.createElement('div');
    this.messageInfoEl.className = 'message-messanger__info';
    this.messageAuthorEl = document.createElement('span');
    this.messageAuthorEl.className = 'message-messanger__author';
    this.messageAuthorEl.textContent = this.username;
    this.messageDateEl = document.createElement('span');
    this.messageDateEl.className = 'message-messanger__date';
    this.messageDateEl.textContent = this.formatDate(this.date);
    this.messageInfoEl.appendChild(this.messageAuthorEl);
    this.messageInfoEl.appendChild(this.messageDateEl);

    this.messageContentEl = document.createElement('div');
    this.messageContentEl.className = 'message-messanger__content content';
    this.messageContentEl.appendChild(this.checkType());

    this.messageEl.appendChild(this.messageInfoEl);
    this.messageEl.appendChild(this.messageContentEl);
    return this.messageEl;
  }

  checkType() {
    switch (this.type) {
      case 'text':
        const textEl = document.createElement('span');
        textEl.className = 'content__text';
        textEl.innerHTML = textfilter(this.content);
        return textEl;
      case 'video':
        return;
      case 'audio':
        return;
      case 'location':
        return;
      case 'image':
        const imgEl = document.createElement('img');
        imgEl.className = 'content__text';
        imgEl.src = this.content;
        return imgEl;
      default:
        return;
    }
  }

  formatDate(date) {
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minute =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const formattedDate = `${hour}:${minute}`;

    return formattedDate;
  }
}
