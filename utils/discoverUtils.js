const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("../db");

let db;
connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

// Takes a list of interests, an amount of groups you want, and returns an equal amount of random groups from each interest. (If there are enough groups) -
function getGroupsBasedOnInterests(interests, amount, allGroups) {
  if (interests.length == 0) {
    return [];
  }
  let outputGroups = [];

  const amountGroupsPerInterest = Math.floor(amount / interests.length);
  let sortedGroups = [];
  let i = 0;

  // Sorts all groups by interest
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

  //From each interest, here it chooses an equal amount of groups per interest.
  // Eg. if we have 2 interests, and we want 10 groups, we get 5 groups from each interest.
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

  // Here we check if the amount of groups we wanted, is equal to the amount of groups we got. If this is not the case, we randomly add groups to match the amount.
  // Eg. if we have 2 interests, and we want 7 groups, then in the code above, we only get 3 groups from each interest, meaning we add one randomly here:
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

  // Shuffle array to randomize order of groups
  outputGroups = shuffleArray(outputGroups);

  return outputGroups;
}

// Simple function for shuffling arrays - used to shuffle groups for the discover page.
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

// Function used to shuffle sorted groups, which is just an object with two properties: interest, and groups.
function shuffleSortedGroups(sortedGroups) {
  sortedGroups.forEach((sortedGroup) => {
    sortedGroup.groups = shuffleArray(sortedGroup.groups);
  });
}

module.exports = { getGroupsBasedOnInterests, shuffleArray };
