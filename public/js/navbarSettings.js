let settingIcon = document.querySelector(".header-settings-icon");
let settingDropdown = document.querySelector(".header-settings-dropdown");
window.addEventListener("click", (e) => {
  e.stopPropagation();

  settingDropdown.hidden = true;
});

// Dropdown menu for settings
settingIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  settingDropdown.hidden
    ? (settingDropdown.hidden = false)
    : (settingDropdown.hidden = true);
});
