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

const select1InfoBoxes = document.querySelectorAll(".user-information-select1-container");
const select2InfoBoxes = document.querySelectorAll(".user-information-select2-container");
const numberInfoBoxes = document.querySelectorAll(".user-information-number-container");
const textInfoBoxes = document.querySelectorAll(".user-information-text-container");

userEditButton.addEventListener("click", () => { 
  textInfoBoxes.forEach((box) => {
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

userEditButton.addEventListener("click", () => {
  numberInfoBoxes.forEach((box2) => {
    const initialValue2 = box2.firstElementChild.innerText;
    box2.firstElementChild.hidden = true;
    inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.classList = "profile-information-input";
    inputElement.value = initialValue2;
    inputElement.name = box2.firstElementChild.id
    box2.appendChild(inputElement);
  });
});
let locationList = ["Aalborg"]
userEditButton.addEventListener("click", () => {
  select1InfoBoxes.forEach((box3) => {
    box3.firstElementChild.hidden = true;
    locationSelectElement = document.createElement("select");
    locationSelectElement.classList = "profile-information-select";
    locationSelectElement.name = box3.firstElementChild.id;
    box3.appendChild(locationSelectElement);

    for (let i = 0; i < locationList[i].length; i++) {
      let locationOption = document.createElement("option");
      locationOption.value = locationList[i];
      locationOption.text = locationList[i];
      locationSelectElement.appendChild(locationOption);
    }
  });
});
let genderList = ["Female","Male","Other"]
userEditButton.addEventListener("click", () => {
  select2InfoBoxes.forEach((box4) => {
    box4.firstElementChild.hidden = true;
    genderSelectElement = document.createElement("select");
    genderSelectElement.classList = "profile-information-select";
    genderSelectElement.name = box4.firstElementChild.id;
    box4.appendChild(genderSelectElement);

    
    for (let j = 0; j < genderList[j].length; j++) {
      let genderOption = document.createElement("option");
      genderOption.value = genderList[j];
      genderOption.text = genderList[j];
      genderSelectElement.appendChild(genderOption);
      console.log(genderOption.text)
      console.log(box4.firstElementChild.innerText)
    }
  });
});

userCancelButton.addEventListener("click", () => {
  select1InfoBoxes.forEach((box5) => {
    box5.firstElementChild.hidden = false;
    box5.removeChild(box5.lastElementChild);
  });
  select2InfoBoxes.forEach((box6) => {
    box6.firstElementChild.hidden = false;
    box6.removeChild(box6.lastElementChild);
  });
  textInfoBoxes.forEach((box7) => {
    box7.firstElementChild.hidden = false;
    box7.removeChild(box7.lastElementChild);
  });
  numberInfoBoxes.forEach((box8) => {
    box8.firstElementChild.hidden = false;
    box8.removeChild(box8.lastElementChild);
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

// User show password JS
const userPasswordInput = document.getElementById("newPassword")
const userPasswordShow = document.querySelector(".password-eye-icon")
const userConfirmPasswordInput = document.getElementById("newConfirmPassword")
const userConfirmPasswordShow = document.querySelector(".confirm-password-eye-icon")

userPasswordShow.addEventListener("mouseover", function () {
  userPasswordInput.type = "text";
});
userPasswordShow.addEventListener("mouseout", function () {
  userPasswordInput.type = "password";
});

userConfirmPasswordShow.addEventListener("mouseover", function () {
  userConfirmPasswordInput.type = "text";
});
userConfirmPasswordShow.addEventListener("mouseout", function () {
  userConfirmPasswordInput.type = "password";
});