// Calendar functionality

// Get elements
let monthTitle = document.querySelector(".calendarMonth-title");
const scaleDownMonthBtn = document.querySelector("#scaleDownMonth");
const scaleUpMonthBtn = document.querySelector("#scaleUpMonth");
const calenderHeaderContainer = document.querySelector(
  ".calendarContent-header"
);
const calenderContent = document.querySelector(".calendarContent-body");

// User events passed from hidden input
const eventsJSON = document.querySelector(".events");
const events = JSON.parse(eventsJSON.value);

// for each event, push date object to array. Indexes match with corrosponding event in events array
let participatedEventDates = [];
events.forEach((event) => {
  participatedEventDates.push(
    new Date(event.date.year, event.date.month - 1, event.date.day)
  );
});

// Group events and user id passed from hidden input
const nonParticipantEventsJSON = document.querySelector(".nonParticipantEvents");
const nonParticipantEvents = JSON.parse(nonParticipantEventsJSON.value);

//for each group, for each event, push date object to array if user is not participant.
let nonParticipatedEventDates = []; 

nonParticipantEvents.forEach((event) => {
  nonParticipatedEventDates.push(
    new Date(event.date.year, event.date.month - 1, event.date.day)
  );
});


// Add eventlisteners
scaleDownMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() - 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth + " " + workingDate.getFullYear();
  drawCalendar(workingDate, events);
});

scaleUpMonthBtn.addEventListener("click", () => {
  workingDate.setMonth(workingDate.getMonth() + 1);
  displayMonth = stringifyMonth(workingDate);
  monthTitle.textContent = displayMonth + " " + workingDate.getFullYear();
  drawCalendar(workingDate, events);
});

// Allows use of arrow keys to change month
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    workingDate.setMonth(workingDate.getMonth() - 1);
    displayMonth = stringifyMonth(workingDate);
    monthTitle.textContent = displayMonth + " " + workingDate.getFullYear();
    drawCalendar(workingDate, events);
  } else if (e.key === "ArrowRight") {
    workingDate.setMonth(workingDate.getMonth() + 1);
    displayMonth = stringifyMonth(workingDate);
    monthTitle.textContent = displayMonth + " " + workingDate.getFullYear();
    drawCalendar(workingDate, events);
  }
});

// Get current date
const todayDate = new Date();

// Misc operations before display
let displayMonth = stringifyMonth(todayDate);
let workingDate = todayDate;

// Update HTML content
monthTitle.textContent = displayMonth + " " + todayDate.getFullYear();
drawCalendar(workingDate, events);


// Main calendar function
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
      currentDate.getMonth() === todayDate.getMonth() &&
      currentDate.getFullYear() === todayDate.getFullYear()
    ) {
      dayDiv.classList.add("calendarContent-day-today");
      dayText.textContent += " (Today)";
    }

    const eventContainer = document.createElement("div");
    eventContainer.classList.add("calendarContent-day-event-container");
    dayDiv.appendChild(eventContainer);

    // Check if day has user participated events
    participatedEventDates.forEach((eventDate) => {
      if (
        eventDate.getDate() === i &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      ) {
        // Create event anchor with link to event page.
        let link =
          "/user/groups/" +
          events[participatedEventDates.indexOf(eventDate)].groupId +
          "/events/" +
          events[participatedEventDates.indexOf(eventDate)]._id;
        const eventAnchor = document.createElement("a");
        const eventAnchorName = document.createElement("div");
        eventAnchor.setAttribute("href", link);
        eventAnchorName.textContent =
          events[participatedEventDates.indexOf(eventDate)].eventName;
        eventAnchor.classList.add("calendarContent-day-event");
        eventAnchorName.classList.add("calenderContent-day-event-name");
        eventContainer.appendChild(eventAnchor);
        eventAnchor.appendChild(eventAnchorName);

        // Add start time of event and TODO status
        const eventTime = document.createElement("div");
        eventTime.classList.add("calendarContent-day-event-time");
        eventTime.textContent = checkCorrectTime(events[participatedEventDates.indexOf(eventDate)].date.hour, events[participatedEventDates.indexOf(eventDate)].date.minute);
        

        eventAnchor.appendChild(eventTime);

        // Change background color of day
        dayDiv.classList.add("calendarContent-day-event-bg");
      }
    });

    // Check if day has group events user is not participating
    nonParticipatedEventDates.forEach((eventDate) => {
      if (
        eventDate.getDate() === i &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      ) {
        // Create event anchor with link to event page.
        let link =
          "/user/groups/" +
          nonParticipantEvents[nonParticipatedEventDates.indexOf(eventDate)]
            .groupId +
          "/events/" +
          nonParticipantEvents[nonParticipatedEventDates.indexOf(eventDate)]._id;
        const eventAnchor = document.createElement("a");
        const eventAnchorName = document.createElement("div");
        eventAnchor.setAttribute("href", link);
        eventAnchorName.textContent =
          nonParticipantEvents[nonParticipatedEventDates.indexOf(eventDate)]
            .eventName;
        eventAnchor.classList.add("calendarContent-day-groupEvent");  //groupEvent are events user is not participating in
        eventAnchorName.classList.add("calenderContent-day-event-name");
        eventContainer.appendChild(eventAnchor);
        eventAnchor.appendChild(eventAnchorName);

        // Add start time of event
        const eventTime = document.createElement("div");
        eventTime.classList.add("calendarContent-day-event-time");
        eventTime.textContent = checkCorrectTime(nonParticipantEvents[nonParticipatedEventDates.indexOf(eventDate)].date.hour, nonParticipantEvents[nonParticipatedEventDates.indexOf(eventDate)].date.minute);
        eventAnchor.appendChild(eventTime);

        // Change background color of day if user is not already participating in an event
        if(dayDiv.classList.contains("calendarContent-day-event-bg") === false){
          dayDiv.classList.add("calendarContent-day-groupEvent-bg");
        }
      }
    }); 

  }
}


// Helper Functions
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

function checkCorrectTime(hour, minute) {
  // Takes hour and minute as input and returns time in correct format
  let time = "";
  if (hour < 10) {
    time += "0" + hour + ":";
  } else {
    time += hour + ":";
  }
  if (minute < 10) {
    time += "0" + minute;
  } else {
    time += minute;
  }
  return time;
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
