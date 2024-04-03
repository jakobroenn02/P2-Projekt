const closeButton = document.querySelector(".create-event-modal-header-close");
const modal = document.querySelector(".create-event-modal");

closeButton.addEventListener("click", () => {
  modal.hidden = true;
});

document.onkeydown = function (e) {
  if (e.code == "Escape") {
    modal.hidden = true;
  }
};
