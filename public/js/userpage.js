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
