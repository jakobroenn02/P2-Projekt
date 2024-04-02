const closeButton = document.querySelector(".create-event-modal-header-close");

closeButton.addEventListener("click", () => {
  const modal = document.querySelector(".create-event-modal");
  modal.hidden = true;
});
