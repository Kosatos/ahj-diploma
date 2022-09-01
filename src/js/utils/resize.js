export default function resize(target, height) {
  target.style.height = height;
  target.style.height = target.scrollHeight + 'px';
}
