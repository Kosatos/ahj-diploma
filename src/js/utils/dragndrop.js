import changeHandler from './changeHandler';

// обработка событий движения мыши в области добавления файла

export default function dragndropAddListeners(target, popup) {
  target.addEventListener('dragover', (event) => {
    event.preventDefault();
    const dragArea = event.currentTarget.querySelector('.droparea');
    dragArea.classList.remove(null);
  });
  target.addEventListener('dragleave', (event) => {
    const dragArea = event.currentTarget.querySelector('.droparea');
    dragArea.classList.add(null);
  });
  target.addEventListener('drop', (event) => {
    event.preventDefault();

    const dragArea = event.currentTarget.querySelector('.droparea');
    if (!dragArea) return;

    changeHandler(event, popup, 'drop');
    dragArea.classList.add(null);
  });
}
