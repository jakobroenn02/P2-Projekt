let socket = io();

// Listeners
socket.on("connect", () => {
  let groupId = window.location.pathname.split("/")[3];
  socket.emit("join", groupId, (err) => {});

  // scroll to bottom of text messages by default
  if (typeof scrollToBottom != "undefined") {
    scrollToBottom();
  }
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
