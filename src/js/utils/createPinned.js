// инициализирует отображение закрепленного сообщения

import element from './element';
export default function createPinned(message, server) {
  const pinnedEl = element('div', 'messanger__pinned pinned-message');
  const pinnedInfo = element('div', 'pinned-message__info');
  pinnedEl.appendChild(pinnedInfo);

  const pinnedTitle = element(
    'span',
    'pinned-message__title',
    'Pinned message'
  );
  const pinnedContent = element('span', 'pinned-message__content');
  message.content.forEach((mes) => {
    if (mes.type === 'text') {
      pinnedContent.textContent = `${mes.body.substr(0, 50)}...`;
    } else if (mes.type === 'location') {
      pinnedContent.textContent = 'Your current location';
    } else {
      pinnedContent.textContent = 'Message media';
    }
  });
  pinnedInfo.appendChild(pinnedTitle);
  pinnedInfo.appendChild(pinnedContent);

  const closeBtn = element('button', 'pinned-message__close messanger-btn');
  pinnedEl.appendChild(closeBtn);

  pinnedEl.addEventListener('click', (event) => {
    if (event.target === closeBtn) {
      return;
    }
    document
      .querySelector('.message-messanger[data-id="' + message.id + '"]')
      .scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  });

  closeBtn.addEventListener('click', () => {
    pinnedEl.remove();
    server.send(
      JSON.stringify({
        unpinMessage: true,
        pinned: false,
        id: message.id,
      })
    );
  });

  return pinnedEl;
}
