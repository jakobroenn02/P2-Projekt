// Js for sending custom message when joining group.
const leaveButton = document.querySelector(
  ".event-page-top-button-leave-event"
);

const joinButton = document.querySelector(".event-page-top-button-join-event");

// Prints "user left an event" in chat
leaveButton.addEventListener("click", (e) => {
  const inputFields = leaveButton.parentElement.children;
  let groupId;
  let userName;
  let eventName;
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].name == "name") {
      userName = inputFields[i].value;
    } else if ((inputFields[i].name == "groupId")) {
      groupId = inputFields[i].value;
    } else if (inputFields[i].name == "eventName") {
      eventName = inputFields[i].value;
    }
  }

  const message = {
    messageText: `${userName} just left "${eventName}"`,
    authorName: "Admin",
    createdAt: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDay(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    },
    authorId: null,
    isCustom: true,
  };

  fetch(`/user/groups/${groupId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(message),
  });
  socket.emit("createMessage", groupId, message, (message) => {});
});

// Prints "user joined an event" in chat
joinButton.addEventListener("click", (e) => {
    const inputFields = leaveButton.parentElement.children;
    let groupId;
    let userName;
    let eventName;
    for (let i = 0; i < inputFields.length; i++) {
      if (inputFields[i].name == "name") {
        userName = inputFields[i].value;
      } else if ((inputFields[i].name == "groupId")) {
        groupId = inputFields[i].value;
      } else if (inputFields[i].name == "eventName") {
        eventName = inputFields[i].value;
      }
    }
  
    const message = {
      messageText: `${userName} just joined "${eventName}"`,
      authorName: "Admin",
      createdAt: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDay(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      },
      authorId: null,
      isCustom: true,
    };
  
    fetch(`/user/groups/${groupId}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(message),
    });
    socket.emit("createMessage", groupId, message, (message) => {});
  });