import {
  mediaButtons,
  mediaControllers,
  recAudioBtn,
  recVideoBtn,
  clearMediaBtn,
  sendMediaBtn,
  mediaTimer,
} from './constants';
import element from '../utils/element';
import createMessageBody from '../utils/createMessageBody';

export default class AudioVideoRecorder {
  constructor(server) {
    this.server = server;
  }

  init() {
    recAudioBtn.addEventListener('click', () => {
      mediaButtons.classList.add('null');
      mediaControllers.classList.remove('null');
      mediaControllers.classList.add('show');
      this.audioRecorder();
    });

    recVideoBtn.addEventListener('click', () => {
      mediaButtons.classList.add('null');
      mediaControllers.classList.remove('null');
      mediaControllers.classList.add('show');
      this.audioRecorder(true);
    });
  }

  async audioRecorder(recVideo = false) {
    if (!navigator.mediaDevices) {
      throw new Error(
        'Audio and video recording are not supported by the browser.'
      );
      recAudioBtn.disable = true;
      recVideoBtn.disable = true;
      return;
    }
    try {
      let save = true;
      let time = 0;
      let timer = null;

      if (!window.MediaRecorder) {
        throw new Error('The browser needs permission to record media.');
        recAudioBtn.disable = true;
        recVideoBtn.disable = true;
        return;
      }

      recAudioBtn.disable = false;
      recVideoBtn.disable = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: recVideo,
      });

      if (recVideo) {
        const preview = element('video', 'video-preview');
        preview.controls = true;
        preview.muted = 'muted';
        preview.srcObject = stream;
        document.body.appendChild(preview);
        preview.play();
      }

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.start();

      recorder.addEventListener('start', () => {
        timer = setInterval(() => {
          mediaTimer.textContent = this.setTimer(time++);
        }, 1000);
      });

      recorder.addEventListener('dataavailable', (evt) => {
        chunks.push(evt.data);
      });

      recorder.addEventListener('stop', async () => {
        clearInterval(timer);
        mediaTimer.textContent = '00:00';
        if (save) {
          let mediaType = 'audio';
          if (recVideo) {
            mediaType = 'video';
          }

          const blob = new Blob(chunks, { type: `${mediaType}/mp4` });

          const fr = new FileReader();
          fr.readAsDataURL(blob);

          fr.onload = () => {
            const src = fr.result;

            const message = createMessageBody('person', [
              {
                type: mediaType,
                body: src,
				filename: 'Voice message',
              },
            ]);
            this.server.send(message);
          };
        }
        if (recVideo) {
          document.querySelector('.video-preview').remove();
        }
        mediaControllers.classList.add('null');
        mediaButtons.classList.remove('null');
        mediaButtons.classList.add('show');
      });

      sendMediaBtn.addEventListener('click', () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        save = true;
      });

      clearMediaBtn.addEventListener('click', () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        save = false;
      });
    } catch (e) {
      throw new Error('The browser needs permission to record media.');
      recAudioBtn.disable = true;
      recVideoBtn.disable = true;
    }
  }

  setTimer(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }
}
