const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

function countLocations(users) {
  let locations = [];
}

function getGroupsBasedOnInterests(interests, amount, allGroups) {
  let outputGroups = [];

  const amountGroupsPerInterest = Math.floor(amount / interests.length);
  let sortedGroups = [];
  let i = 0;

  interests.forEach((interest) => {
    sortedGroups.push({ interest: interest, groups: [] });
    allGroups.forEach((group) => {
      if (group.interest == interest) {
        sortedGroups[i].groups.push(group);
      }
    });
    i++;
  });

  shuffleSortedGroups(sortedGroups);

  for (let y = 0; y < sortedGroups.length; y++) {
    while (
      !(outputGroups.length > (y + 1) * amountGroupsPerInterest) &&
      sortedGroups[y].groups.length >= 1
    ) {
      const randomNum = Math.floor(
        Math.random() * sortedGroups[y].groups.length
      );
      outputGroups.push(sortedGroups[y].groups[randomNum]);
      sortedGroups[y].groups.splice(randomNum, 1);
    }
  }

  if (outputGroups.length < amount) {
    const missingAmount = amount - outputGroups.length;
    for (let i = 0; i < missingAmount; i++) {
      const randomSortedGroupsIndex = Math.floor(
        Math.random() * sortedGroups.length
      );

      const randomSortedGroup = sortedGroups[randomSortedGroupsIndex];
      const randomSortedGroupIndex = Math.floor(
        Math.random() * randomSortedGroup.groups.length
      );
      if (randomSortedGroup.groups.length !== 0) {
        const randomGroup = randomSortedGroup.groups[randomSortedGroupIndex];
        outputGroups.push(randomGroup);
      }
    }
  }

  outputGroups = shuffleArray(outputGroups);

  return outputGroups;
}

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
function shuffleSortedGroups(sortedGroups) {
  sortedGroups.forEach((sortedGroup) => {
    sortedGroup.groups = shuffleArray(sortedGroup.groups);
  });
}

module.exports = { getGroupsBasedOnInterests };
