import Message from './components/Message';
import Chatbot from './components/Chatbot';
import botdata from './components/botdata';
import {
  messageForm,
  typeMessageInput,
  chat,
  addFileInput,
  addFileBtn,
} from './components/constants';

window.onload = () => {
  typeMessageInput.addEventListener('input', (event) => {
    resize(event.target, '50px');
  });

  addFileBtn.addEventListener('click', () => {
    addFileInput.click();
  });
  addFileInput.addEventListener('change', (event) => {
    console.log(Array.from(event.target.files));
  });

  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    const botCharlie = new Chatbot('Jarvis the Bot', botdata, ws);

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

function resize(target, height) {
  target.style.height = height;
  target.style.height = target.scrollHeight + 'px';
}
