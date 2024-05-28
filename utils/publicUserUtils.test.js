const { commonGroupsIds, commonEventsIds } = require("./publicUserUtils");
const { ObjectId } = require("mongodb");

describe("commonGroupsIds", () => {
  it("should return common group ids", () => {
    const user1GroupIds = {
      groupIds: [
        new ObjectId("66228a36ebdee4f5e6c4804c"),
        new ObjectId("66228a36ebdee4f5e6c4804d"),
        new ObjectId("66228a36ebdee4f5e6c4804f"),
      ],
    };
    const user2GroupIds = {
      groupIds: [
        new ObjectId("66228a36ebdee4f5e6c4804d"),
        new ObjectId("66228a36ebdee4f5e6c4804f"),
        new ObjectId("66228a36ebdee4f5e6c48050"),
      ],
    };

    const result = commonGroupsIds(user1GroupIds, user2GroupIds);

    expect(result).toEqual([
      new ObjectId("66228a36ebdee4f5e6c4804d"),
      new ObjectId("66228a36ebdee4f5e6c4804f"),
    ]);
  });

  it("should return an empty array when there are no common group ids", () => {
    const user1GroupIds = {
      groupIds: [
        new ObjectId("66228a36ebdee4f5e6c4804c"),
        new ObjectId("66228a36ebdee4f5e6c4804d"),
      ],
    };
    const user2GroupIds = {
      groupIds: [
        new ObjectId("66228a36ebdee4f5e6c4804f"),
        new ObjectId("66228a36ebdee4f5e6c48050"),
      ],
    };

    const result = commonGroupsIds(user1GroupIds, user2GroupIds);

    expect(result).toEqual([]);
  });

  it("should return an empty array when one or both users have no group ids", () => {
    const user1GroupIds = { groupIds: [] };
    const user2GroupIds = {
      groupIds: [
        new ObjectId("66228a36ebdee4f5e6c4804d"),
        new ObjectId("66228a36ebdee4f5e6c4804f"),
      ],
    };

    const result = commonGroupsIds(user1GroupIds, user2GroupIds);

    expect(result).toEqual([]);
  });

  it("should return all group ids when all are common", () => {
    const commonIds = [
      new ObjectId("66228a36ebdee4f5e6c4804c"),
      new ObjectId("66228a36ebdee4f5e6c4804d"),
    ];
    const user1GroupIds = { groupIds: commonIds };
    const user2GroupIds = { groupIds: commonIds };

    const result = commonGroupsIds(user1GroupIds, user2GroupIds);

    expect(result).toEqual(commonIds);
  });
});

describe("commonEventsIds", () => {
  it("should return common event ids", () => {
    const user1EventIds = {
      eventIds: [
        new ObjectId("66228a38ebdee4f5e6c48087"),
        new ObjectId("66228a38ebdee4f5e6c4808a"),
        new ObjectId("66228a37ebdee4f5e6c48086"),
      ],
    };
    const user2EventIds = {
      eventIds: [
        new ObjectId("66228a38ebdee4f5e6c4808a"),
        new ObjectId("66228a37ebdee4f5e6c48086"),
        new ObjectId("66228a38ebdee4f5e6c48089"),
      ],
    };

    const result = commonEventsIds(user1EventIds, user2EventIds);

    expect(result).toEqual([
      new ObjectId("66228a38ebdee4f5e6c4808a"),
      new ObjectId("66228a37ebdee4f5e6c48086"),
    ]);
  });

  it("should return an empty array when there are no common event ids", () => {
    const user1EventIds = {
      eventIds: [
        new ObjectId("66228a38ebdee4f5e6c48087"),
        new ObjectId("66228a38ebdee4f5e6c4808a"),
      ],
    };
    const user2EventIds = {
      eventIds: [
        new ObjectId("66228a37ebdee4f5e6c48086"),
        new ObjectId("66228a38ebdee4f5e6c48089"),
      ],
    };

    const result = commonEventsIds(user1EventIds, user2EventIds);

    expect(result).toEqual([]);
  });

  it("should return an empty array when one or both users have no event ids", () => {
    const user1EventIds = { eventIds: [] };
    const user2EventIds = {
      eventIds: [
        new ObjectId("66228a38ebdee4f5e6c4808a"),
        new ObjectId("66228a37ebdee4f5e6c48086"),
      ],
    };

    const result = commonEventsIds(user1EventIds, user2EventIds);

    expect(result).toEqual([]);
  });

  it("should return all event ids when all are common", () => {
    const commonIds = [
      new ObjectId("66228a38ebdee4f5e6c48087"),
      new ObjectId("66228a38ebdee4f5e6c4808a"),
    ];
    const user1EventIds = { eventIds: commonIds };
    const user2EventIds = { eventIds: commonIds };

    const result = commonEventsIds(user1EventIds, user2EventIds);

    expect(result).toEqual(commonIds);
  });
});
