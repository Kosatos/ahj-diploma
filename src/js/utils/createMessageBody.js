export default function createMessageBody(usertype, content, botname = '') {
  return JSON.stringify({
    usertype: usertype,
    botname: botname,
    content: content,
    pinned: false,
    favorite: false,
  });
}
