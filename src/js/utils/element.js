// создание DOM-элемента

export default function element(tagname, classname = '', content = '') {
  const el = document.createElement(tagname);
  el.className = classname;
  if (content) el.textContent = content;
  return el;
}
