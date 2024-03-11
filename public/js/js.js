
const settingsButton = document.querySelector(".header-settings-icon");
const dropdown = document.querySelector(".settings-dropdown");

settingsButton.addEventListener("click", (e) => {
    if(window.getComputedStyle(dropdown).display == "none") {
        dropdown.style.display = "flex";
    } else {
        dropdown.style.display = "none";
    }
})


const DeleteButton = document.getElementById("delete-account-form").addEventListener('submit',function(event){
    event.preventDefault();
    if (document.getElementById('delete-account').checked){
      fetch('/user/delete-profile', {
        method: 'DELETE',
        })
        .then((response) => response.text())
        .then(data => 
          console.log(data))
  }
  });

