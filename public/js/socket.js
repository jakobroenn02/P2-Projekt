let socket = io();

// Listeners
socket.on("connect", () => {
  let groupId = window.location.pathname.split("/")[3];
  socket.emit("join", groupId, (err) => {});

  // scroll to bottom of text messages by default
  scrollToBottom();
});

socket.on("disconnect", () => {
  // Here we can do stuff when user is disconnected if necessary
});

// listener for displaying messages on the screen.
socket.on("displayMessage", (message) => {
  const messagesDiv = document.querySelector(".group-messages");
  messagesDiv.appendChild(generateMessageDiv(message, false));
  scrollToBottom();
});

// Button on click
const messageSendButton = document.querySelector(".group-message-send-button");
messageSendButton.addEventListener("click", (e) => {
  // Prevent default so browser doesn't refresh
  e.preventDefault();
  const groupId = window.location.pathname.split("/")[3];
  const messageInput = document.querySelector(
    '.group-message-input-form [name="message"]'
  );
  const messageAuthorNameInput = document.querySelector(
    '.group-message-input-form [name="authorName"]'
  );
  const messageUserIdInput = document.querySelector(
    '.group-message-input-form [name="userId"]'
  );

  const message = {
    messageText: messageInput.value,
    authorName: messageAuthorNameInput.value,
    createdAt: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDay(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    },
    authorId: messageUserIdInput.value,
  }

  // Creates post reqruest here instead of from form, beacuase we dont want browser to refresh
  fetch(`/user/groups/${groupId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(message),
  });

  // We emit a socket "createMessage" event, which emits a "displayMessage" to all connection of the socket
  socket.emit(
    "createMessage",
    groupId,
    message,
    (message) => {}
  );

  const messagesDiv = document.querySelector(".group-messages");
  messagesDiv.appendChild(
    generateMessageDiv(
      message,
      true
    )
  );
  resetMessageInput();
  scrollToBottom();
});

// TODO Man skal kunne differentiere mellem udefrakommende emits, og dine egne - Baseret på de skal klassen være "yours" eller ej.
// function for generation a message div
function generateMessageDiv(message, isOwn) {
  let newMessageDiv = document.createElement("div");
  newMessageDiv.classList = isOwn ? "group-message-yours" : "group-message";

  let newMessageInfoDiv = document.createElement("div");
  newMessageInfoDiv.classList = "group-message-info";

  let newMessageAuthorDiv = document.createElement("div");
  newMessageAuthorDiv.classList = "group-message-author";
  newMessageAuthorDiv.innerText = message.authorName;

  let newMessageDateDiv = document.createElement("div");
  newMessageDateDiv.classList = "group-message-date";
  newMessageDateDiv.innerText = `${message.createdAt.hour}:${message.createdAt.minute}`;

  newMessageInfoDiv.appendChild(newMessageAuthorDiv);
  newMessageInfoDiv.appendChild(newMessageDateDiv);

  let newMessageTextDiv = document.createElement("div");
  newMessageTextDiv.classList = "group-message-text";
  newMessageTextDiv.innerText = message.messageText;

  newMessageDiv.appendChild(newMessageInfoDiv);
  newMessageDiv.appendChild(newMessageTextDiv);

  return newMessageDiv;
}

// Scrolls to bottom of messages div
function scrollToBottom() {
  const lastMessage =
    document.querySelector(".group-messages").lastElementChild;
  lastMessage.scrollIntoView();
}

function resetMessageInput() {
  const messageInput = document.querySelector(
    '.group-message-input-form [name="message"]'
  );
  messageInput.value = "";
  messageInput.focus();
}
