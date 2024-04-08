// Creates a message object with relevant properties.
function generateMessage(authorName, messageText, authorId, isCustom) {
  return {
    authorName: authorName,
    messageText: messageText,
    createdAt: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDay(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
    },
    authorId: authorId,
    isCustom: isCustom,
  };
}

module.exports = { generateMessage };
