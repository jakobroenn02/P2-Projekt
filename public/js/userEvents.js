// JS for creating new event

let createEventButton = document.querySelector(
  ".user-events-create-event-button"
);
const creatEventModal = document.querySelector(".create-event-modal");

createEventButton.addEventListener("click", () => {
  if (creatEventModal.hidden) {
    creatEventModal.hidden = false;
  } else {
    creatEventModal.hidden = true;
  }
});
