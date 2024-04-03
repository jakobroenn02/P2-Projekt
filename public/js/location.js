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
//wip