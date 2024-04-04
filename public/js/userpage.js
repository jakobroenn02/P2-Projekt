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

const infoBoxes = document.querySelectorAll(".profile-information-container");
userEditButton.addEventListener("click", () => {
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
  infoBoxes.forEach((box) => {
    box.firstElementChild.hidden = false;
    box.removeChild(box.lastElementChild);
  });
  userEditButton.hidden = false;
  userCancelButton.hidden = true;
  userConfirmButton.hidden = true;
})

userConfirmButton.addEventListener("click", () => {
  
  userEditButton.hidden = false;
  userCancelButton.hidden = true;
  userConfirmButton.hidden = true;
})

// User edit bio JS
const userBioConfirmButton = document.querySelector(
  ".profile-bio-confirm-button"
);
const userBioCancelButton = document.querySelector(
  ".profile-bio-cancel-button"
);
const userBioEditButton = document.querySelector(
  ".profile-bio-edit-button"
);

const bioBox = document.querySelector(".profile-bio-container");

userBioEditButton.addEventListener("click", () => {
  const initValue = bioBox.firstElementChild.innerText;
  bioBox.firstElementChild.hidden = true;
  textAreaElement = document.createElement("textarea");
  textAreaElement.type = "text";
  textAreaElement.classList = "profile-bio-input";
  textAreaElement.value = initValue;
  textAreaElement.name = bioBox.firstElementChild.id;
  bioBox.appendChild(textAreaElement);

  userBioEditButton.hidden = true;
  userBioCancelButton.hidden = false;
  userBioConfirmButton.hidden = false;
});

userBioCancelButton.addEventListener("click", () => {
  bioBox.firstElementChild.hidden = false;
  bioBox.removeChild(bioBox.lastElementChild);
  userBioEditButton.hidden = false;
  userBioCancelButton.hidden = true;
  userBioConfirmButton.hidden = true;
});

userBioConfirmButton.addEventListener("click", () => {
  userBioEditButton.hidden = false;
  userBioCancelButton.hidden = true;
  userBioConfirmButton.hidden = true;
});

// User edit password JS

const userPasswordConfirmButton = document.querySelector(".password-confirm-button");
const userPasswordCancelButton = document.querySelector(".password-cancel-button");
const userPasswordEditButton = document.querySelector(".password-edit-button");

userPasswordConfirmButton.hidden = true;
userPasswordCancelButton.hidden = true;

const passwordBoxes = document.querySelectorAll(".password-input-container");

userPasswordEditButton.addEventListener("click", () => {
  passwordBoxes.forEach((box) => {
    passwordBoxes.forEach((box) => {
      box.firstElementChild.disabled = false
  });
  userPasswordConfirmButton.hidden = false;
  userPasswordCancelButton.hidden = false;
  userPasswordEditButton.hidden = true;
});

userPasswordCancelButton.addEventListener("click", () => {
  passwordBoxes.forEach((box) => {
    box.firstElementChild.disabled = true
  });
  userPasswordConfirmButton.hidden = true;
  userPasswordCancelButton.hidden = true;
  userPasswordEditButton.hidden = false;
})

userPasswordConfirmButton.addEventListener("click", () => {
  passwordBoxes.forEach((box) => {
    box.firstElementChild.disabled = true
  });
  userPasswordConfirmButton.hidden = true;
  userPasswordCancelButton.hidden = true;
  userPasswordEditButton.hidden = false;
});


// User show password JS
const userOldPasswordInput = document.getElementById("oldPassword")
const userOldPasswordShow = userOldPasswordInput.nextElementSibling;

userOldPasswordShow.addEventListener("mouseover", function () {
  userOldPasswordInput.type = "text";
});
userOldPasswordShow.addEventListener("mouseout", function () {
  userOldPasswordInput.type = "password";
});

const userNewPasswordInput = document.getElementById("newPassword")
const userNewPasswordShow = userNewPasswordInput.nextElementSibling;

userNewPasswordShow.addEventListener("mouseover", function () {
  userNewPasswordInput.type = "text";
});
userNewPasswordShow.addEventListener("mouseout", function () {
  userNewPasswordInput.type = "password";
});

const userConfirmPasswordInput = document.getElementById("newConfirmPassword")
const userConfirmPasswordShow = userConfirmPasswordInput.nextElementSibling;

userConfirmPasswordShow.addEventListener("mouseover", function () {
  userConfirmPasswordInput.type = "text";
});
userConfirmPasswordShow.addEventListener("mouseout", function () {
  userConfirmPasswordInput.type = "password";
});
});