// Calendar functionality

// Import elements
const monthTitle = document.querySelector(".calendarMonth-title");
const scaleDownMonthBtn = document.querySelector("#scaleDownMonth");
const scaleUpMonthBtn = document.querySelector("#scaleUpMonth");


// Add eventlisteners
scaleDownMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() - 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth;
});

scaleUpMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() + 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth;
});


// Get current date
const todayDate = new Date();

// Misc operations before display
let displayMonth = stringifyMonth(todayDate);
let workingDate = todayDate;


// Update HTML content
monthTitle.textContent = displayMonth;


// Functions
function stringifyMonth(date) { // Takes date object and returns month in string format
  date = date.toLocaleString("default", { month: "long" })
  return date.charAt(0).toUpperCase() + date.slice(1);
}








// JS for creating new event

let createEventButton = document.querySelector(
  ".user-events-create-event-button"
);
const creatEventModal = document.querySelector(".create-event-modal");

createEventButton.addEventListener("click", () => {
  if (creatEventModal.hidden) {
    creatEventModal.hidden = false;
  } else {
    creatEventModal.hidden = true;
  }
});
