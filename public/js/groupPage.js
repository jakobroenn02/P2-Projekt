const settingsDropdownButton = document.querySelector(
  ".groupSettingsDropdownButton"
);
const dropdown = document.querySelector(".group-dropdown");
const groupLeaveButton = document.querySelector(".group-leave-button");

settingsDropdownButton.addEventListener("click", (e) => {
  console.log(dropdown.hidden);
  dropdown.hidden ? (dropdown.hidden = false) : (dropdown.hidden = true);
});


