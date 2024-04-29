// Calendar functionality

// Import elements
const monthTitle = document.querySelector(".calendarMonth-title");
const scaleDownMonthBtn = document.querySelector("#scaleDownMonth");
const scaleUpMonthBtn = document.querySelector("#scaleUpMonth");
const calenderHeaderContainer = document.querySelector(
  ".calendarContent-header"
);
const calenderContent = document.querySelector(".calendarContent-body");

// Add eventlisteners
scaleDownMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() - 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth;
  drawCalendar(workingDate);
});

scaleUpMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() + 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth;
  drawCalendar(workingDate);
});

// Get current date
const todayDate = new Date();

// Misc operations before display
let displayMonth = stringifyMonth(todayDate);
let workingDate = todayDate;

// Update HTML content
monthTitle.textContent = displayMonth;
drawCalendar(workingDate);


// Functions
function stringifyMonth(date) {
  // Takes date object and returns month in string format
  date = date.toLocaleString("default", { month: "long" });
  return date.charAt(0).toUpperCase() + date.slice(1);
}

function stringifyDay(date) {
  // Takes date object and returns month in string format
  date = date.toLocaleString("default", { weekday: "long" });
  return date.charAt(0).toUpperCase() + date.slice(1);
}


function drawCalendar(currentDate){
  // Clear previous content
  calenderContent.innerHTML = "";

  // If day 1 is not monday, add days from previous month until first monday
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  for(let i = firstDay - 2; i >= 0; i--){
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("calendarContent-day");
    dayDiv.classList.add("calendarContent-day-prevMonth");
    calenderContent.appendChild(dayDiv);

    const dayText = document.createElement("div");
    dayText.classList.add("calendarContent-day-text");
    dayText.textContent = daysInPrevMonth - i;
    dayDiv.appendChild(dayText);
  }   

  // Add days in current month
  const daysCount = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  for(let i = 1; i <= daysCount; i++){
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("calendarContent-day");
    calenderContent.appendChild(dayDiv);

    const dayText = document.createElement("div");
    dayText.classList.add("calendarContent-day-text");
    dayText.textContent = i;
    dayDiv.appendChild(dayText);
  }


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
