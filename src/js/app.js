import Message from './components/Message';
import Chatbot from './components/Chatbot';
import AddFilePopup from './components/AddFilePopup';
import botdata from './components/botdata';
import resize from './utils/resize';
import changeHandler from './utils/changeHandler';
import dragndropAddListeners from './utils/dragndrop';

import {
  messageForm,
  typeMessageInput,
  chat,
  addFileInput,
  addFileBtn,
} from './components/constants';

window.onload = () => {
  [...document.forms].forEach((form) => form.reset());

  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    const botCharlie = new Chatbot('Jarvis the Bot', botdata, ws);

    const addPopup = new AddFilePopup(ws);

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const el = new Message(data).render();
      if (data.content) chat.appendChild(el);
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    messageForm.addEventListener('submit', function (event) {
      event.preventDefault();
      sendMessage(ws, this, botCharlie);
    });
    typeMessageInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage(ws, this.closest('form'), botCharlie);
      }
    });
    addFileInput.addEventListener('change', (event) => {
      changeHandler(event, addPopup);
      event.currentTarget.value = '';
    });
    typeMessageInput.addEventListener('input', (event) => {
      resize(event.target, '50px');
    });
    addFileBtn.addEventListener('click', () => {
      addFileInput.click();
    });
    dragndropAddListeners(chat, addPopup);
  };
};

function sendMessage(server, form, bot) {
  const message = {
    usertype: 'person',
    type: 'text',
    content: typeMessageInput.value,
  };
  server.send(JSON.stringify(message));
  bot.reply(message.content);
  form.reset();
  resize(typeMessageInput, '50px');
}
