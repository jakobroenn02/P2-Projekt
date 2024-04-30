// JS related to the modal of changing profile image.
const modal = document.querySelector(".userpage-pictures-modal");

// Opens modal
const changePicButton = document.querySelector(".userpage-left-image-change");
changePicButton.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Closes modal
const modalCloseButton = document.querySelector("#userpage-closeButton");
modalCloseButton.addEventListener("mousedown", function () {
  modal.style.display = "none";
});

const modalConfirmButton = document.querySelector(
  ".userpage-profilePictureChangeConfirm"
);
let modalProfilePicture = document.querySelector(".userpage-modalProfPic");
let profileImageIdNumberInput = document.querySelector(
  ".userpage-profileImageIdNumber"
);

const profilePictureOptions = document.querySelectorAll(
  ".userpage-pictureOption"
);
profilePictureOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // Each image choice in modal can be clicked and will change the id of profile picture in DB. Is updated on button post.
    modalProfilePicture.src = option.src;
    profileImageIdNumberInput.value = option.id;
    modalConfirmButton.hidden = false;
  });
});

//
//
//
//
//
//JS related to user settings (three dots/ellipsis on the user page)

const settingButton = document.querySelector(".userpage-left-settings-button");
const settingsContainer = document.querySelector(
  ".userpage-left-settings-container"
);

settingButton.addEventListener("click", (e) => {
  e.stopPropagation();
  if (settingsContainer.hidden == true) {
    settingsContainer.hidden = false;
  } else {
    settingsContainer.hidden = true;
  }
});

window.document.addEventListener("click", (e) => {
  settingsContainer.hidden = true;
});

//
//
//
//
//JS related to buttons on dropdown of settings:

// Edit user button
const editUserButton = document.querySelector(".userpage-left-settings-edit");
editUserButton.addEventListener("click", (e) => {
  e.stopPropagation();

  const editFormContainer = document.querySelector(".userpage-left-info-edit");
  const infoContainer = document.querySelector(".userpage-left-info");
  const userPageElement = document.querySelector(".userpage");

  infoContainer.hidden = true;
  editFormContainer.hidden = false;
  settingsContainer.hidden = true;

  // Calculate the position to scroll to so that the element is in the middle of the container
  const elementTop =
    editFormContainer.getBoundingClientRect().top -
    userPageElement.getBoundingClientRect().top;

  // Scroll to the calculated position within the container
  userPageElement.scrollTo({
    top: elementTop,
    behavior: "smooth", // Optional: Add smooth scrolling effect
  });
});

//
//
//
//delete user button:
const deleteUserModal = document.querySelector(
  ".userpage-delete-confirm-modal"
);
const deleteUserButton = document.querySelector(
  ".userpage-left-settings-delete"
);
deleteUserButton.addEventListener("click", (e) => {
  deleteUserModal.hidden = false;
});

const confirmDeleteButton = document.querySelector(
  ".userpage-delete-confirm-modal-delete-button"
);

confirmDeleteButton.addEventListener("click", (e) => {
  fetch("http://localhost:3000/user/delete", {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((res) => {
    console.log(res);
    if (res.ok) {
      window.location.href = "/";
    } else {
      console.error("Error deleting user");
    }
  });
});

const cancelDeleteButton = document.querySelector(
  ".userpage-delete-confirm-modal-cancel-button"
);
cancelDeleteButton.addEventListener("click", (e) => {
  deleteUserModal.hidden = true;
});

//
//
//
// Change password button
const changePasswordButton = document.querySelector(
  ".userpage-left-settings-change"
);
changePasswordButton.addEventListener("click", (e) => {
  const changePasswordModal = document.querySelector(
    ".userpage-change-password-modal"
  );

  //Closes modal
  changePasswordModal.hidden = false;
});

//JS for update user form

//
//
//
//
//Js for cancel of userinfo form
const cancelUpdateButton = document.querySelector(
  ".userpage-left-info-cancel-button"
);
cancelUpdateButton.addEventListener("click", (e) => {
  const infoContainer = document.querySelector(".userpage-left-info");
  const editFormContainer = document.querySelector(".userpage-left-info-edit");

  editFormContainer.hidden = true;
  infoContainer.hidden = false;
});

//
//
//
//
//
//Js for search of locations

const locationInput = document.querySelector(
  ".userpage-left-info-location-input-edit"
);
const locationsContainer = document.querySelector(
  ".userpage-left-info-locations-list"
);
const locationElements = document.getElementsByClassName(
  "userpage-left-info-location-option"
);

let locations = getAllTextsFromElements(locationElements);

function isRegisterValid() {
  let isValid = true;
  if (!locations.includes(locationInput.value)) {
    isValid = false;
  }
  return isValid;
}

function getAllTextsFromElements(elements) {
  let output = [];
  for (let i = 0; i < elements.length; i++) {
    output.push(elements[i].innerText);
  }
  return output;
}

locationInput.addEventListener("keyup", (e) => {
  for (let i = 0; i < locationElements.length; i++) {
    if (
      !locationElements[i].innerText
        .toLowerCase()
        .includes(locationInput.value.toLowerCase())
    ) {
      locationElements[i].hidden = true;
    } else {
      locationElements[i].hidden = false;
    }
  }
});

locationInput.addEventListener("focusout", (e) => {
  locationsContainer.hidden = true;
});

locationInput.addEventListener("focusin", (e) => {
  locationsContainer.hidden = false;

  for (let i = 0; i < locationElements.length; i++) {
    locationElements[i].hidden = false;
  }
});

for (let i = 0; i < locationElements.length; i++) {
  locationElements[i].addEventListener("mousedown", (e) => {
    locationInput.value = locationElements[i].innerText;
  });
}

//
//
//
//
//Js for change pass modal.
//Cancel change pass button:
const cancelChangePassButton = document.querySelector(
  ".userpage-left-change-password-cancel-button"
);

cancelChangePassButton.addEventListener("click", (e) => {
  const inputFields = document.querySelectorAll(
    ".userpage-left-change-password-modal-container input"
  );
  const changePasswordModal = document.querySelector(
    ".userpage-change-password-modal"
  );

  //Start by resetting all input fields.
  inputFields.forEach((input) => {
    input.value = "";
  });

  //Closes modal
  changePasswordModal.hidden = true;
});
