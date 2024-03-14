const editFirstName = document.getElementById("newFirstName");
const toggleEditFirstName = document.querySelector(".firstname-toggle-icon i");
const editLastName = document.getElementById("newLastName");
const toggleEditLastName = document.querySelector(".lastname-toggle-icon i");
const editUsername = document.getElementById("newUsername");
const toggleEditUsername = document.querySelector(".username-toggle-icon i");
const editEmail = document.getElementById("newEmail");
const toggleEditEmail = document.querySelector(".email-toggle-icon i");
const editPassword = document.getElementById("newPassword");
const toggleEditPassword = document.querySelector(".password-toggle-icon i");
const editConfirmPassword = document.getElementById("confirmNewPassword");
const toggleEditConfirmPassword = document.querySelector(
  ".confirm-password-toggle-icon i"
);
const editAge = document.getElementById("newAge");
const toggleEditAge = document.querySelector(".age-toggle-icon i");
const editLocation = document.getElementById("newLocation");
const toggleEditLocation = document.querySelector(".location-toggle-icon i");

// JS for header settings dropdown
const settingsButton = document.querySelector(".header-settings-icon");

settingsButton.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".settings-dropdown");
  if (window.getComputedStyle(dropdown).display == "none") {
    dropdown.style.display = "flex";
  } else {
    dropdown.style.display = "none";
  }
});

// Js for modal on userpage
const profilePicture = document.querySelector(".profile-picture");
const modalCloseButton = document.querySelector(".modal-header-close");

modalCloseButton.addEventListener("click", () => {
  const pictureModal = document.querySelector(".pictures-modal");
  pictureModal.style.display = "none";
});

profilePicture.addEventListener("click", () => {
  const pictureModal = document.querySelector(".pictures-modal");
  pictureModal.style.display = "flex";
});

toggleEditPassword.addEventListener("mouseover", function () {
  editPassword.type = "text";
});
toggleEditPassword.addEventListener("mouseout", function () {
  editPassword.type = "password";
});

toggleEditConfirmPassword.addEventListener("mouseover", function () {
  editConfirmPassword.type = "text";
});
toggleEditConfirmPassword.addEventListener("mouseout", function () {
  editConfirmPassword.type = "password";
});

toggleEditFirstName.addEventListener("click", function () {
    toggleEditFirstName.document.createElement("input");
    
});
