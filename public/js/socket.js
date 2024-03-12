let socket = io();

// Listeners
socket.on("connect", () => {});

socket.on("disconnect", () => {});

socket.on("displayMessage", (message) => {
  const messagesDiv = document.querySelector(".group-messages");
  messagesDiv.appendChild(generateMessageDiv(message));
});

// Button on click
const messageSendButton = document.querySelector(".group-message-send-button");
messageSendButton.addEventListener("click", (e) => {
  // Prevent default so browser doesn't refresh
  e.preventDefault();

  // input information
  const messageInput = document.querySelector(
    '.group-message-input-form [name="message"]'
  );
  const messageAuthorFirstNameInput = document.querySelector(
    '.group-message-input-form [name="authorFirstName"]'
  );

  // Creates post reqruest here instead of from form, beacuase we dont want browser to refresh
  fetch("/user/groups/65eeccde5a6dae74bff61bdb", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      messageText: messageInput.value,
      authorFirstName: messageAuthorFirstNameInput.value,
    }),
  });

  // We emit a socket "createMessage" event, which emits a "displayMessage" to all connection of the socket
  socket.emit(
    "createMessage",
    {
      authorFirstName: messageAuthorFirstNameInput.value,
      messageText: messageInput.value,
    },
    (message) => {}
  );
});

// function for generation a message div
function generateMessageDiv(message) {
  let newMessageDiv = document.createElement("div");
  newMessageDiv.classList = "group-message";

  let newMessageAuthorDiv = document.createElement("div");
  newMessageAuthorDiv.classList = "group-message-author";
  newMessageAuthorDiv.innerText = message.authorFirstName;

  let newMessageTextDiv = document.createElement("div");
  newMessageTextDiv.classList = "group-message-text";
  newMessageTextDiv.innerText = message.messageText;

  newMessageDiv.appendChild(newMessageAuthorDiv);
  newMessageDiv.appendChild(newMessageTextDiv);

  return newMessageDiv;
}
