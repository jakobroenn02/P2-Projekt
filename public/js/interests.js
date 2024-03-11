//JS for search input on interests page
const inputInterests = document.querySelector(".interestsSearchInput");
const interestsContainer = document.querySelector(".interestsContainerWrapper");
inputInterests.addEventListener("keyup", (e) => {
  var children = interestsContainer.children;
  for (var i = 0; i < children.length - 1; i++) {
    //-1 because last element is the save button
    if (
      !children[i].innerText
        .toLowerCase()
        .includes(inputInterests.value.toLowerCase())
    ) {
      children[i].style.display = "none";
    } else {
      children[i].style.display = "block";
    }
  }
});

//JS for click on specific interests
const specificInterestCheckboxes = document.querySelectorAll(
  ".specificInterestCheckbox"
);
const interestsPageRightWrapper = document.querySelector(
  ".interestsPageRightWrapper"
);

// Adds on change eventlistener to all interests
specificInterestCheckboxes.forEach((box) => {
  box.addEventListener("change", (e) => {
    if (e.target.checked) {
      // if check - add to right box + make background of interest black
      interestsPageRightWrapper.appendChild(
        createNewSelectedInterestElement(e.target.value)
      );
      updateSpecificInterest(
        e.target.value.replaceAll(" ", "-"),
        e.target.checked
      );
    } else {
      // if uncheck - remove from right box + make background of interest white

      removeSelectedInterest(e.target.value.replaceAll(" ", "-"));
      updateSpecificInterest(
        e.target.value.replaceAll(" ", "-"),
        e.target.checked
      );
    }
  });
});

document.querySelectorAll(".specificSelectedInterest").forEach((elem) => {
  elem.addEventListener("click", () => {
    const interest = elem.innerText
    uncheckSpecificInterest(interest);
    updateSpecificInterest(interest.replaceAll(" ", "-"), false);
    removeSelectedInterest(interest.replaceAll(" ", "-"));
  });
});

//Function for creating new interest div for right interests box (selected)
function createNewSelectedInterestElement(interest) {
  const newSelectedElement = document.createElement("div");
  newSelectedElement.innerText = interest;
  newSelectedElement.classList.add("specificSelectedInterest");
  newSelectedElement.id = `specific-${interest.replaceAll(" ", "-")}-selected`;
  newSelectedElement.addEventListener("click", () => {
    uncheckSpecificInterest(interest);
    updateSpecificInterest(interest.replaceAll(" ", "-"), false);
    removeSelectedInterest(interest.replaceAll(" ", "-"));
  });
  return newSelectedElement;
}

// Function for updating interest based on if checked or unchecked
function updateSpecificInterest(interestId, check) {
  const idToLook = `specific-${interestId}`;
  const checkboxParent = document.getElementById(idToLook);
  checkboxParent.style.backgroundColor = check ? "black" : "white";
  checkboxParent.style.color = check ? "white" : "black";
}

// Function for removing selected interests on right box if unchecked
function removeSelectedInterest(interestId) {
  const unSelectedElement = document.querySelector(
    `#specific-${interestId}-selected`
  );
  unSelectedElement.remove();
}

function uncheckSpecificInterest(interest) {
  document.getElementById(
    `specific-${interest.replaceAll(" ", "-")}-checkbox`
  ).checked = false;
}

