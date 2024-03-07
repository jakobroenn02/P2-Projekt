
const settingsButton = document.querySelector(".header-settings-icon");
const dropdown = document.querySelector(".settings-dropdown");

settingsButton.addEventListener("click", (e) => {
    if(window.getComputedStyle(dropdown).display == "none") {
        dropdown.style.display = "flex";
    } else {
        dropdown.style.display = "none";
    }
})




