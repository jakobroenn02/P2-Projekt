const { response } = require("express");

const settingsButton = document.querySelector(".header-settings-icon");
const dropdown = document.querySelector(".settings-dropdown");
const pictureProfile = document.querySelector(".profile-picture-picture");
const pictureModal = document.querySelector(".pictures-modal");
const closeModal = document.querySelector(".close-mark");
const modalButton = document.querySelector(".change-picture-button");
const selectNewPicture = document.querySelectorAll("modal-pictures-options-container"); 

settingsButton.addEventListener("click", (e) => {
  if (window.getComputedStyle(dropdown).display == "none") {
    dropdown.style.display = "flex";
  } else {
    dropdown.style.display = "none";
  }
});

modalButton.addEventListener("click", () => {
  pictureModal.style.display = "flex";
});

pictureProfile.addEventListener("click", () => {
  pictureModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  pictureModal.style.display = "none";
});

selectNewPicture.forEach((picture) => {
  picture.addEventListener("click", (e) => {
    pictureProfile.src = e.target.src;
    pictureModal.style.display = "none";
    
    fetch('/updateProfilePicture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user._id,
        profileImageId: e.target.id }),
  })
  .then((response) => response.json())
  .then(data => {
    console.log(data);
    user.profileImageId = data.profileImageId;
  })
  .catch((error) => console.log('error:', error));
});
});