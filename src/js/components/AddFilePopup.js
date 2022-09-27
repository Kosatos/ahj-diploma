import bytesToSize from '../utils/bytesToSIze';
import element from '../utils/element';
import changeHandler from '../utils/changeHandler';
import dragndropAddListeners from '../utils/dragndrop';
import icons from './icons';
import createMessageBody from '../utils/createMessageBody';
import { chat, loader } from './constants';

// popup для добавления и отправки файлов на сервер

export default class AddFilePopup {
  constructor(server) {
    this.server = server;
    this.content = [];
  }

  render() {
    this.popup = element('div', 'add-file-popup');
    this.popupOverlay = element('div', 'add-file-popup__overlay');
    this.popup.appendChild(this.popupOverlay);

    this.popupBody = element('div', 'add-file-popup__body');
    this.popupOverlay.appendChild(this.popupBody);
    dragndropAddListeners(this.popupBody, this);

    this.popupFiles = element('div', 'add-file-popup__files');
    this.popupBody.appendChild(this.popupFiles);

    this.popupControllers = element('div', 'add-file-popup__controllers');
    this.popupBody.appendChild(this.popupControllers);

    this.controllersLeft = element('div', 'controllers__left');
    this.popupControllers.appendChild(this.controllersLeft);

    this.addFileBtn = element(
      'button',
      'controllers__add-btn popup-btn',
      'add'
    );
    this.controllersLeft.appendChild(this.addFileBtn);

    this.addFileInput = element('input', 'controllers__add-input null');
    this.addFileInput.type = 'file';
    this.addFileInput.setAttribute('multiple', true);
    this.controllersLeft.appendChild(this.addFileInput);

    this.addFileBtn.addEventListener('click', () => this.addFileInput.click());
    this.addFileInput.addEventListener('change', (event) => {
      changeHandler(event, this);
      event.currentTarget.value = '';
    });

    this.controllersRight = element('div', 'controllers__right');
    this.popupControllers.appendChild(this.controllersRight);
    this.cancelBtn = element(
      'button',
      'controllers__cancel-btn popup-btn',
      'cancel'
    );
    this.controllersRight.appendChild(this.cancelBtn);
    this.cancelBtn.addEventListener('click', () => this.removeEl(this.popup));

    this.sendBtn = element('button', 'controllers__send-btn popup-btn', 'send');
    this.controllersRight.appendChild(this.sendBtn);
    this.sendBtn.addEventListener('click', () => {
      const message = createMessageBody('person', this.content);
      this.server.send(message);
      chat.appendChild(loader.render());
      this.content = [];
      this.removeEl(this.popup);
    });

    this.dragArea = element('div', 'add-file-popup__droparea droparea null');
    this.dragArea.innerHTML = `<b>Drop files here</b> <br>to send them`;
    this.popupBody.appendChild(this.dragArea);

    return this.popup;
  }

  addFile(file, src) {
    if (!this.popupFiles) return;
    console.log(file);

    const fileEl = element('div', 'add-file-popup__file file');
    const fileLeft = element('div', 'file__left');
    fileEl.appendChild(fileLeft);
    const fileIcon = element('img', 'file__icon');
    fileIcon.src = this.checkFileType(file);

    fileLeft.appendChild(fileIcon);

    const fileInfo = element('div', 'file__info');
    fileLeft.appendChild(fileInfo);

    const fileTitle = element('div', 'file__title', file.name);
    const fileSize = element('div', 'file__size', bytesToSize(file.size));
    fileInfo.appendChild(fileTitle);
    fileInfo.appendChild(fileSize);

    const deleteBtn = element('button', 'file__delete-btn messanger-btn');
    fileEl.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', async () => {
      await this.removeEl(fileEl);
      if (!this.popupFiles.children.length) {
        this.cancelBtn.click();
      }
    });

    this.popupFiles.appendChild(fileEl);
    this.content.push({
      type: file.type.split('/')[0],
      body: src,
      filename: file.name,
    });
  }

  async removeEl(el) {
    return new Promise((res, rej) => {
      el.classList.toggle('removing');
      setTimeout(() => {
        el.remove();
        res(true);
      }, 400);
    });
  }

  checkFileType(file) {
    if (file.type.match('image')) {
      return icons.image;
    } else if (file.type.match('audio')) {
      return icons.audio;
    } else if (file.type.match('video')) {
      return icons.video;
    } else {
      return icons.file;
    }
  }
}
