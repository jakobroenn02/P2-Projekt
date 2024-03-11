let settingIcon = document.querySelector('.header-settings-icon');
let settingDropdown = document.querySelector(".header-settings-dropdown");
window.addEventListener('click', (e) => {
    e.stopPropagation();
    settingDropdown.hidden = true;
    console.log(settingDropdown.hidden);
});

settingIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    settingDropdown.hidden ? settingDropdown.hidden = false : settingDropdown.hidden = true;
    console.log(settingDropdown.hidden);
});