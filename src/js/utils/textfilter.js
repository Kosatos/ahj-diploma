// фильтрация вводимого сообщение на наличие ссылок

export default function (str) {
  var re = /([^\"=]{2}|^)((https?|ftp):\/\/\S+[^\s.,> )\];'\"!?])/;
  var subst = '$1<a href="$2" target="_blank">$2</a>';
  return str.replace(re, subst);
}
