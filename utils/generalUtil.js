function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// DOES NOT TAKE A DATE OBJECT AS INPUT, but instead uses birth object from db. Returns age as a number.
function getAgeFromBirthDate(date) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  if (
    date.month < currentMonth ||
    (date.month === currentMonth && date.day <= currentDay)
  ) {
    return currentYear - date.year;
  } else {
    return currentYear - date.year - 1;
  }
}

module.exports = { getRandomElement, getAgeFromBirthDate };
