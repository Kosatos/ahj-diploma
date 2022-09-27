import createMessageBody from './createMessageBody';

// получение координат геопозиции и отправка тела сообщения на сервер

export default function getPosition(server) {
  function getCoords(position) {
    server.send(
      createMessageBody('person', [
        {
          type: 'location',
          body: `${position.coords.latitude}, ${position.coords.longitude}`,
        },
      ])
    );
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCoords);
  }
}
