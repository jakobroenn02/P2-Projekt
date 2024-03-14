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

//User edit information JS
const userConfirmButton = document.querySelector(
  ".profile-information-confirm-button"
);
const userCancelButton = document.querySelector(
  ".profile-information-cancel-button"
);
const userEditButton = document.querySelector(
  ".profile-information-edit-button"
);


userEditButton.addEventListener("click", () => {
  const infoBoxes = document.querySelectorAll(".profile-information-container");
  infoBoxes.forEach((box) => {
    const initValue = box.firstElementChild.innerText;
    box.firstElementChild.hidden = true;
    inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.classList = "profile-information-input";
    inputElement.value = initValue;
    inputElement.name = box.firstElementChild.id
    box.appendChild(inputElement);
  });

  userEditButton.hidden = true;
  userCancelButton.hidden = false;
  userConfirmButton.hidden = false;
});

userCancelButton.addEventListener("click", () => {
  
  userEditButton.hidden = false;
  userCancelButton.hidden = true;
  userConfirmButton.hidden = true;
})

userConfirmButton.addEventListener("click", () => {
  
  userEditButton.hidden = false;
  userCancelButton.hidden = true;
  userConfirmButton.hidden = true;
})
