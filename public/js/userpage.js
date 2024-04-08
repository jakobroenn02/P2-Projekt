// file: userpage.js
document.addEventListener("DOMContentLoaded", () => {
  const profilePicture = document.querySelector(".profile-picture");
  let modalProfilePicture = document.querySelector(".modalProfPic");
  const modalConfirmButton = document.querySelector(".profilePictureChangeConfirm");
  let profileImageIdNumber = document.querySelector(".profileImageIdNumber");
  const modalCloseButton = document.querySelector("#closeButton");
  const profilePictureOptions = document.querySelectorAll(".pictureOption");
  const pictureModal = document.querySelector(".pictures-modal");

  modalCloseButton.addEventListener('mousedown', function() {
    pictureModal.style.display = 'none';
  });

  

  profilePicture.addEventListener("click", () => {  // Opens modal
    const pictureModal = document.querySelector(".pictures-modal");
    pictureModal.style.display = "flex";
  });

  profilePictureOptions.forEach((option) => { 
    option.addEventListener("click", () => {  // Each image choice in modal can be clicked and will change the id of profile picture in DB. Is updated on button post.
      modalProfilePicture.src = option.src;
      profileImageIdNumber.value = option.id;
      modalConfirmButton.hidden = false;
    });
  });
});