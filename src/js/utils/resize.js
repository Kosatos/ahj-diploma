// динамическая высота тестового поля для воода сообщения

export default function resize(target, height) {
  target.style.height = height;
  target.style.height = target.scrollHeight + 'px';
}
