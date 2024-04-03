//Js for ellipse-vertical dropdown
const settingsDropdownButton = document.querySelector(".groupSettingsDropdownButton");
const dropdown = document.querySelector(".group-dropdown");
const groupLeaveButton = document.querySelector(".group-leave-button");

settingsDropdownButton.addEventListener("click", (e) => {
  e.stopPropagation(); 
  dropdown.hidden = !dropdown.hidden; 
});
groupLeaveButton.addEventListener("click", (e) => {
  const userConfirmed = window.confirm("Are you sure you want to leave the group?");
  if (!userConfirmed) {
    e.preventDefault(); 
  }
});

document.addEventListener("click", (e) => {
  if (!settingsDropdownButton.contains(e.target) && !dropdown.contains(e.target)) {
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

