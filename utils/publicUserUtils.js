const { ObjectId } = require("mongodb");
// Takes 2 users, and returns the group ids they have in common
function commonGroupsIds(user1, user2) {
  let user1Ids = user1.groupIds.map((id) => `${id}`);
  let user2Ids = user2.groupIds.map((id) => `${id}`);
  let commonGroupIds = user2Ids.filter((id) => user1Ids.includes(id));
  commonGroupIds = commonGroupIds.map((id) => new ObjectId(`${id}`));
  return commonGroupIds;
}

// Takes 2 users, and returns the event ids they have in common
function commonEventsIds(user1, user2){
    let user1Ids = user1.eventIds.map((id) => `${id}`);
    let user2Ids = user2.eventIds.map((id) => `${id}`);
    let commonEventIds = user2Ids.filter((id) => user1Ids.includes(id));
    commonEventIds = commonEventIds.map((id) => new ObjectId(`${id}`));
    return commonEventIds;

}





module.exports = { commonGroupsIds, commonEventsIds };
