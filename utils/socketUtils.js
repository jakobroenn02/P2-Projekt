function generateMessage(authorName, messageText, authorId) {
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
  };
}

module.exports = { generateMessage };
