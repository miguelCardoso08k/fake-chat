const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const user = { id: "", name: "", color: "" };

let webSocket;

const createMessageSelf = (content) => {
  const div = document.createElement("div");

  div.classList.add("message--self");

  div.innerHTML = content;

  return div;
};

const createMessageOther = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--self");
  div.classList.add("message--other");
  span.classList.add("message--sender");
  span.style.color = senderColor;

  div.appendChild(span);
  span.innerHTML = sender;
  div.innerHTML += content;

  return div;
};

const getRandomColor = () => {
  const randonIndex = Math.floor(Math.random() * colors.length);

  return colors[randonIndex];
};

const scrollWindow = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { userID, userName, userColor, content } = JSON.parse(data);

  const message =
    userID == user.id
      ? createMessageSelf(content)
      : createMessageOther(content, userName, userColor);

  chatMessages.appendChild(message);
  scrollWindow();
};

const handleLogin = (e) => {
  e.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  webSocket = new WebSocket("wss://fake-chat-api.onrender.com");
  webSocket.onmessage = processMessage;
};

const sendMassege = (e) => {
  e.preventDefault();
  const msg = {
    userID: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  webSocket.send(JSON.stringify(msg));
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMassege);
