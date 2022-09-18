import Message from './components/Message';
import Chatbot from './components/Chatbot';
import AddFilePopup from './components/AddFilePopup';
import botdata from './components/botdata';
import resize from './utils/resize';
import changeHandler from './utils/changeHandler';
import dragndropAddListeners from './utils/dragndrop';
import createMessageBody from './utils/createMessageBody';
import sendMessage from './utils/sendMessage';
import AudioVideoRecorder from './components/AudioVideoRecorder';
import getPosition from './utils/getPosition';
import createPinned from './utils/createPinned';

import {
  messageForm,
  typeMessageInput,
  chat,
  chatContainer,
  addFileInput,
  addFileBtn,
  loader,
  searchForm,
  searchInput,
  noResultAlarm,
  showFavoriteBtn,
  sendGeoBtn,
} from './components/constants';

window.onload = () => {
  [...document.forms].forEach((form) => form.reset());

  const ws = new WebSocket('ws://localhost:8080');
  let allLoaded = false;

  ws.onopen = () => {
    const botCharlie = new Chatbot('Jarvis the Bot', botdata, ws);
    ws.send(JSON.stringify({ init: true }));
    const appRecorder = new AudioVideoRecorder(ws);
    appRecorder.init();
    const addPopup = new AddFilePopup(ws);
    let favoriteShowed = false;

    ws.onmessage = (message) => {
      if (loader.loaderEl) loader.loaderEl.remove();
      const data = JSON.parse(message.data);
      console.log(data);
      if (data.search || data.init) {
        if (!data.messages.length) {
          noResultAlarm.classList.remove('null');
          noResultAlarm.classList.add('show');
        } else {
          noResultAlarm.classList.add('null');
          noResultAlarm.classList.remove('show');
        }

        [...chat.children].forEach((el) => el.remove());
        data.messages.forEach((mes) => {
          const el = new Message(mes, ws).render();
          if (mes.content) chat.appendChild(el);
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      } else if(data.lazyload) {
        console.log(data.messages);
        data.messages.forEach((mes) => {
          const el = new Message(mes, ws).render();
          if(chat.firstChild) 
          if (mes.content) chat.insertBefore(el, chat.firstChild);
        });
      } else if(data.allLoaded) {
        allLoaded = data.allLoaded;
      } else if (data.showFavorite) {
        if (!data.messages.length) {
          favoriteShowed = false;
          showFavoriteBtn.classList.remove('showed');
          return;
        }
        favoriteShowed = true;
        showFavoriteBtn.classList.add('showed');
        [...chat.children].forEach((el) => el.remove());
        data.messages.forEach((mes) => {
          const el = new Message(mes, ws).render();
          el.querySelector('.message-controllers').classList.add('null');
          if (mes.content) chat.appendChild(el);
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      } else if (data.showAll) {
        [...chat.children].forEach((el) => el.remove());
        data.messages.forEach((mes) => {
          favoriteShowed = false;
          showFavoriteBtn.classList.remove('showed');
          const el = new Message(mes, ws).render();
          if (mes.content) chat.appendChild(el);
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        });
      } else if (data.pinMessage) {
        chat.insertAdjacentElement(
          'afterbegin',
          createPinned(data.message, ws)
        );
      } else {
        const el = new Message(data, ws).render();
        if (data.content) chat.appendChild(el);
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    messageForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (typeMessageInput.value === '') {
        return;
      }
      sendMessage(
        ws,
        createMessageBody('person', [
          { type: 'text', body: typeMessageInput.value },
        ]),
        botCharlie,
        this,
        typeMessageInput
      );
    });
    typeMessageInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (typeMessageInput.value === '') {
          return;
        } else {
          sendMessage(
            ws,
            createMessageBody('person', [
              { type: 'text', body: typeMessageInput.value },
            ]),
            botCharlie,
            this.closest('form'),
            this
          );
        }
      }
    });
    addFileInput.addEventListener('change', (event) => {
      changeHandler(event, addPopup);
      event.currentTarget.value = '';
    });
    typeMessageInput.addEventListener('input', (event) => {
      resize(event.target, '50px');
    });
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const request = {
        search: true,
        value: searchInput.value.toLowerCase(),
      };
      ws.send(JSON.stringify(request));
    });
    searchInput.addEventListener('input', function () {
      if (this.value === '') {
        ws.send(JSON.stringify({ init: true }));
      }
      return;
    });
    addFileBtn.addEventListener('click', () => {
      addFileInput.click();
    });
    showFavoriteBtn.addEventListener('click', () => {
      if (favoriteShowed) {
        ws.send(JSON.stringify({ showAll: true }));
      } else {
        ws.send(JSON.stringify({ showFavorite: true }));
      }
    });
    sendGeoBtn.addEventListener('click', () => {
      getPosition(ws);
    });
    chat.addEventListener('scroll', () => {
      if(!chat.scrollTop && !allLoaded) {
        ws.send(JSON.stringify({ init: true }))
      }
    })
    dragndropAddListeners(chatContainer, addPopup);
    document.addEventListener('dragover', (event) => event.preventDefault());
    document.addEventListener('drop', (event) => event.preventDefault());
  };
};
