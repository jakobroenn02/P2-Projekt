const settingsButton = document.querySelector(".header-settings-icon");
const dropdown = document.querySelector(".settings-dropdown");

settingsButton.addEventListener("click", (e) => {
  if (window.getComputedStyle(dropdown).display == "none") {
    dropdown.style.display = "flex";
  } else {
    dropdown.style.display = "none";
  }
});

const inputInterests = document.querySelector(".interestsSearchInput");
const interestsContainer = document.querySelector(".interestsContainerWrapper");

inputInterests.addEventListener("keyup", (e) => {
  var children = interestsContainer.children;

  for (var i = 0; i < children.length; i++) {
    if (!children[i].innerText.toLowerCase().includes(inputInterests.value.toLowerCase())) {
        children[i].style.display = "none"
    } else {
        children[i].style.display = "block"
        
    }
  }
});
