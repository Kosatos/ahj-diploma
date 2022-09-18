import createMessageBody from './createMessageBody';

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
