// Calendar functionality

// Get elements
const monthTitle = document.querySelector(".calendarMonth-title");
const scaleDownMonthBtn = document.querySelector("#scaleDownMonth");
const scaleUpMonthBtn = document.querySelector("#scaleUpMonth");
const calenderHeaderContainer = document.querySelector(
  ".calendarContent-header"
);
const calenderContent = document.querySelector(".calendarContent-body");

// User events passed from hidden input
const eventsJSON = document.querySelector(".events");
const events = JSON.parse(eventsJSON.value);

let eventDates = [];
events.forEach((event) => {
  // for each event, push date object to array. Indexes match with corrosponding event in events array
  eventDates.push(
    new Date(event.date.year, event.date.month - 1, event.date.day)
  );
});

// Add eventlisteners
scaleDownMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() - 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth;
  drawCalendar(workingDate, events);
});

scaleUpMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() + 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth;
  drawCalendar(workingDate, events);
});

// Allows use of arrow keys to change month
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    workingDate.setMonth(workingDate.getMonth() - 1);
    displayMonth = stringifyMonth(workingDate);
    monthTitle.textContent = displayMonth;
    drawCalendar(workingDate, events);
  } else if (e.key === "ArrowRight") {
    workingDate.setMonth(workingDate.getMonth() + 1);
    displayMonth = stringifyMonth(workingDate);
    monthTitle.textContent = displayMonth;
    drawCalendar(workingDate, events);
  }
});

// Get current date
const todayDate = new Date();

// Misc operations before display
let displayMonth = stringifyMonth(todayDate);
let workingDate = todayDate;

// Update HTML content
monthTitle.textContent = displayMonth;
drawCalendar(workingDate, events);

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

function drawCalendar(currentDate, events) {
  // Clear previous content
  calenderContent.innerHTML = "";
  const todayDate = new Date(); //TODO TodayDate keeps being updated for some reason, so this fixes the issue

  // If day 1 is not monday, add days from previous month until first monday
  let firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1; // Change monday to 0 and sunday to 6
  const daysInPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  for (let i = firstDay; i > 0; i--) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("calendarContent-day");
    dayDiv.classList.add("calendarContent-day-prevMonth");
    calenderContent.appendChild(dayDiv);

    const dayText = document.createElement("div");
    dayText.classList.add("calendarContent-day-text");
    dayText.textContent = daysInPrevMonth - i + 1;
    dayDiv.appendChild(dayText);
  }

  // Add days in current month
  const daysCount = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  for (let i = 1; i <= daysCount; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("calendarContent-day");
    calenderContent.appendChild(dayDiv);

    const dayText = document.createElement("div");
    dayText.classList.add("calendarContent-day-text");
    dayText.textContent = i;
    dayDiv.appendChild(dayText);
    //Check if day is today
    if (
      i === todayDate.getDate() &&
      currentDate.getMonth() === todayDate.getMonth()
    ) {
      dayDiv.classList.add("calendarContent-day-today");
      dayText.textContent += " (Today)";
    }

    // Check if day has events
    eventDates.forEach((eventDate) => {
      if (
        eventDate.getDate() === i &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      ) {
        // Create event anchor with link to event page.
        let link =
          "/user/groups/" +
          events[eventDates.indexOf(eventDate)].groupId +
          "/events/" +
          events[eventDates.indexOf(eventDate)]._id;
        const eventAnchor = document.createElement("a");
        eventAnchor.setAttribute("href", link);
        eventAnchor.textContent =
          events[eventDates.indexOf(eventDate)].eventName;
        eventAnchor.classList.add("calendarContent-day-event");
        dayDiv.appendChild(eventAnchor);
        
        // Change background color of day
        dayDiv.classList.add("calendarContent-day-event-bg");
      }
    });
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
