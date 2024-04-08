const closeButton = document.querySelector(".create-event-modal-header-close");
const modal = document.querySelector(".create-event-modal");
const createEventSubmitButton = document.querySelector(
  ".create-event-submit-button"
);

closeButton.addEventListener("click", () => {
  modal.hidden = true;
});

document.onkeydown = function (e) {
  if (e.code == "Escape") {
    modal.hidden = true;
  }
};

// Prints a custom message to groupchat "user created event"
createEventSubmitButton.addEventListener("click", (e) => {
  const inputFields = createEventSubmitButton.parentElement.children;
  let groupId;
  let userName;
  for (let i = 0; i < inputFields.length; i++) {
    if (inputFields[i].name == "name") {
      userName = inputFields[i].value;
    } else if (inputFields[i].name == "socketGroupId") {
      if (inputFields[i].value == "undefined") {
        // find from select input
        groupId = document.querySelector(".create-event-form-select").value;
      } else {
        groupId = inputFields[i].value;
      }
    }
  }

  const message = {
    messageText: `${userName} just created an event`,
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
