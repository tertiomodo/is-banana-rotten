const messageElem = document.querySelector("[data-message]");

export default function showMessage(msg) {
  messageElem.textContent = msg;
}
