//Js for ellipse-vertical dropdown
const settingsDropdownButton = document.querySelector(
  ".groupSettingsDropdownButton"
);
const dropdown = document.querySelector(".group-dropdown");
const groupLeaveButton = document.querySelector(".group-leave-button");

settingsDropdownButton.addEventListener("click", (e) => {
  console.log(dropdown.hidden);
  dropdown.hidden ? (dropdown.hidden = false) : (dropdown.hidden = true);
});

//Js for right navbar, toggle users & event options.
const eventsToggleButton = document.querySelector(".group-events-toggle");
const usersToggleButton = document.querySelector(".group-users-toggle");

eventsToggleButton.addEventListener("click", () => {
  const eventsOptionsList = document.querySelector(".group-events-list");
  const chevron = document.querySelector(".events-chevron");

  if (eventsOptionsList.hidden) {
    eventsOptionsList.hidden = false;
    chevron.classList.add("fa-chevron-down")
    chevron.classList.remove("fa-chevron-right")
  } else {
    eventsOptionsList.hidden = true;
    chevron.classList.remove("fa-chevron-down")
    chevron.classList.add("fa-chevron-right")
  }
});

usersToggleButton.addEventListener("click", () => {
  const usersOptionsList = document.querySelector(".group-users-list");
  const chevron = document.querySelector(".users-chevron");

  if (usersOptionsList.hidden) {
    usersOptionsList.hidden = false;
    chevron.classList.add("fa-chevron-down")
    chevron.classList.remove("fa-chevron-right")
  } else {
    usersOptionsList.hidden = true;
    chevron.classList.remove("fa-chevron-down")
    chevron.classList.add("fa-chevron-right")
  }
});
