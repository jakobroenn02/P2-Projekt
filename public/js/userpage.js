
const settingsButton = document.querySelector(".header-settings-icon");
const dropdown = document.querySelector(".settings-dropdown");
const pictureProfile = document.querySelector(".profile-picture-picture");
const pictureModal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-mark");

const editFirstName = document.getElementById("newFirstName");
const toggleEditFirstName = document.querySelector(".firstname-toggle-icon i");
const editLastName = document.getElementById("newLastName");
const toggleEditLastName = document.querySelector(".lastname-toggle-icon i");
const editUsername = document.getElementById("newUsername");
const toggleEditUsername = document.querySelector(".username-toggle-icon i");
const editEmail = document.getElementById("newEmail");
const toggleEditEmail = document.querySelector(".email-toggle-icon i");
const editPassword = document.getElementById("newPassword");
const toggleEditPassword = document.querySelector(".password-toggle-icon i");
const editConfirmPassword = document.getElementById("confirmNewPassword");
const toggleEditConfirmPassword = document.querySelector(".confirm-password-toggle-icon i");
const editAge = document.getElementById("newAge");
const toggleEditAge = document.querySelector(".age-toggle-icon i");
const editLocation = document.getElementById("newLocation");
const toggleEditLocation = document.querySelector(".location-toggle-icon i");

settingsButton.addEventListener("click", (e) => {
    if (window.getComputedStyle(dropdown).display == "none") {
        dropdown.style.display = "flex";
    } else {
        dropdown.style.display = "none";
    }
})


pictureProfile.addEventListener("click", () => {
    pictureModal.style.display = "flex";
});
closeModal.addEventListener("click", () => {
    pictureModal.style.display = "none";
});
window.addEventListener("click", (event) => {
    if (event.target == pictureModal) {
        pictureModal.style.display = "none";
    }
});

toggleEditPassword.addEventListener("mouseover", function () {
    editPassword.type = "text";  
});
toggleEditPassword.addEventListener("mouseout", function () {
    editPassword.type = "password";
});

toggleEditConfirmPassword.addEventListener("mouseover", function () {
    editConfirmPassword.type = "text";
});
toggleEditConfirmPassword.addEventListener("mouseout", function () {
    editConfirmPassword.type = "password";
});

toggleEditFirstName.addEventListener("click", function () {
    if (editFirstName.readOnly === true) {
        editFirstName.readOnly = false;
    } else {
        editFirstName.readOnly = true;
    }

});

toggleEditLastName.addEventListener("click", function () {
    if (editLastName.readOnly === true) {
        editLastName.readOnly = false;
    } else {
        editLastName.readOnly = true;
    }
});

toggleEditUsername.addEventListener("click", function () {
    if (editUsername.readOnly === true) {
        editUsername.readOnly = false;
    } else {
        editUsername.readOnly = true;
    }
});

toggleEditEmail.addEventListener("click", function () {
    if (editEmail.readOnly === true) {
        editEmail.readOnly = false;
    }else {
        editEmail.readOnly = true;
    }
});

toggleEditPassword.addEventListener("click", function () {
    if (editPassword.readOnly === true) {
        editPassword.readOnly = false;
        editPassword.classList.remove("fas fa-edit icon");
    } else {
        editPassword.readOnly = true;
        editPassword.classList.add("fas fa-edit icon");
    }
});

toggleEditConfirmPassword.addEventListener("click", function () {
    if (editConfirmPassword.readOnly === true) {
        editConfirmPassword.readOnly = false;
        editPassword.classList.remove("fas fa-edit icon");
    } else {
        editConfirmPassword.readOnly = true;
        editPassword.classList.add("fas fa-edit icon");
    }
});

toggleEditAge.addEventListener("click", function () {
    if (editAge.readOnly === true) {
        editAge.readOnly = false;
    } else {
        editAge.readOnly = true;
    }
});
toggleEditLocation.addEventListener("click", function () {
    if (editLocation.readOnly === true) {
        editLocation.readOnly = false;
    } else {
        editLocation.readOnly = true;
    }
});
// Ved ikke hvordan jeg skal få dette til at fungerere????? Vil gerne have den til at modtage de nye informationer og overskrive de gamle informationer :D 
// TODO: Få dette til at fungerere :D
router.post("/", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        const user = {
            name: { firstName: req.body.newFirstName, lastName: req.body.newLastName },
            password: hashedPassword,
            bio: "",
            age: 0,
            location: "",
            groupIds: [],
            interests: [],
            eventIds: [],
            username: req.body.newUsername,
            email: req.body.newEmail,
        };
        db.collection("users")
            .insertOne(user)
    } catch {
        res.status(500).send();
    }
});


