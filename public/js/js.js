const settingsButton = document.querySelector(".header-settings-icon");

settingsButton.addEventListener("click", (e) => {
    const dropdown = document.querySelector(".settings-dropdown");
    console.log(dropdown.style.display)
    if(dropdown.style.display == "none") {
        dropdown.style.display = "flex";
    } else {
        dropdown.style.display = "none";
    }
})




