// обработчик события добавления файлов

export default function changeHandler(event, popup, eventName = 'change') {
  const data = eventName === 'drop' ? event.dataTransfer : event.target;
  if (!data.files.length) {
    return;
  }

  const files = Array.from(data.files);
  files.forEach((file) => {

    const reader = new FileReader();

    reader.onload = (ev) => {
      const src = ev.target.result;

      if (!document.querySelector('.add-file-popup')) {
        document.body.appendChild(popup.render());
        popup.addFile(file, src);
      } else {
        popup.addFile(file, src);
      }
    };

    reader.readAsDataURL(file);
  });
}
