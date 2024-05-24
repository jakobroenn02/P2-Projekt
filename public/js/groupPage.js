//Js for ellipse-vertical dropdown
const settingsDropdownButton = document.querySelector(
  ".groupSettingsDropdownButton"
);
const dropdown = document.querySelector(".group-dropdown");
const groupLeaveButton = document.querySelector(".group-leave-button");

settingsDropdownButton.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.hidden = !dropdown.hidden;
});
groupLeaveButton.addEventListener("click", (e) => {
  const userConfirmed = window.confirm(
    "Are you sure you want to leave the group?"
  );
  if (!userConfirmed) {
    e.preventDefault();
  }
});

// Close menu if window is clicked
document.addEventListener("click", (e) => {
  if (
    !settingsDropdownButton.contains(e.target) &&
    !dropdown.contains(e.target)
  ) {
    dropdown.hidden = true;
  }
});

//Js for right navbar, toggle users & event options.
const eventsToggleButton = document.querySelector(".group-events-toggle");
const usersToggleButton = document.querySelector(".group-users-toggle");

eventsToggleButton.addEventListener("click", () => {
  const eventsOptionsList = document.querySelector(".group-events-list");
  const chevron = document.querySelector(".events-chevron");

  if (eventsOptionsList.hidden) {
    eventsOptionsList.hidden = false;
    chevron.classList.add("fa-chevron-down");
    chevron.classList.remove("fa-chevron-right");
  } else {
    eventsOptionsList.hidden = true;
    chevron.classList.remove("fa-chevron-down");
    chevron.classList.add("fa-chevron-right");
  }
});

usersToggleButton.addEventListener("click", () => {
  const usersOptionsList = document.querySelector(".group-users-list");
  const chevron = document.querySelector(".users-chevron");

  if (usersOptionsList.hidden) {
    usersOptionsList.hidden = false;
    chevron.classList.add("fa-chevron-down");
    chevron.classList.remove("fa-chevron-right");
  } else {
    usersOptionsList.hidden = true;
    chevron.classList.remove("fa-chevron-down");
    chevron.classList.add("fa-chevron-right");
  }
});

//JS for modal regaring creating events
const createEventButton = document.querySelector(".group-events-create-button");
const creatEventModal = document.querySelector(".create-event-modal");
createEventButton.addEventListener("click", (e) => {
  if (creatEventModal.hidden) {
    creatEventModal.hidden = false;
  } else {
    creatEventModal.hidden = true;
  }
});

// JS for messages (socket)
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

  if (messageInput.value.length === 0) {
    return;
  }

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
    isCustom: false,
  };

  // Creates post reqruest here instead of from form, beacuase we dont want browser to refresh
  fetch(`/user/groups/${groupId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(message),
  });

  // We emit a socket "createMessage" event, which emits a "displayMessage" to all connection of the socket
  socket.emit("createMessage", groupId, message, (message) => {});

  const messagesDiv = document.querySelector(".group-messages");
  messagesDiv.appendChild(generateMessageDiv(message, true));
  resetMessageInput();
  scrollToBottom();
});

// function for generation a message div
function generateMessageDiv(message, isOwn) {
  let newMessageDiv = document.createElement("div");

  if (message.isCustom) {
    newMessageDiv.classList = "group-message-custom";

    let newMessageTextDiv = document.createElement("div");
    newMessageTextDiv.classList = "group-message-custom-text";
    newMessageTextDiv.innerText = message.messageText;

    newMessageDiv.appendChild(newMessageTextDiv);
  } else {
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
  }

  return newMessageDiv;
}
// Scrolls to bottom of messages div
function scrollToBottom() {
  const lastMessage =
    document.querySelector(".group-messages").lastElementChild;
  lastMessage.scrollIntoView();
}

// On send message, reset input
function resetMessageInput() {
  const messageInput = document.querySelector(
    '.group-message-input-form [name="message"]'
  );
  messageInput.value = "";
  messageInput.focus();
}
