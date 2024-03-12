const settingsButton = document.querySelector(".header-settings-icon");
const dropdown = document.querySelector(".settings-dropdown");
const pictureProfile = document.querySelector(".profile-picture-picture");
const pictureModal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-mark");
const modalButton = document.querySelector(".change-picture-button");

settingsButton.addEventListener("click", (e) => {
  if (window.getComputedStyle(dropdown).display == "none") {
    dropdown.style.display = "flex";
  } else {
    dropdown.style.display = "none";
  }
});


   
modalButton.addEventListener("click", () => {
    pictureModal.style.display = "flex";
})

pictureProfile.addEventListener("click", () => {
    pictureModal.style.display = "flex";
})

closeModal.addEventListener("click", () => {
    pictureModal.style.display = "none";
});
window.addEventListener("click", (event) => {
    if (event.target == pictureModal) {
      pictureModal.style.display = "none";
    }
});
