const {generateMessage} = require('./socketUtils');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
      const authorName = 'Shanco Saga';
      const messageText = 'IDK WHAT TO SAY';
      const authorId = '12345';
      const isCustom = false;
  
      const message = generateMessage(authorName, messageText, authorId, isCustom);
  
      expect(typeof message.createdAt).toBe('object');
      expect(message.authorName).toBe(authorName);
      expect(message.messageText).toBe(messageText);
      expect(message.authorId).toBe(authorId);
      expect(message.isCustom).toBe(isCustom);
    });
  
    it('should handle empty string', () => {
      const authorName = '';
      const messageText = '';
      const authorId = '';
      const isCustom = false;
  
      const message = generateMessage(authorName, messageText, authorId, isCustom);
  
      expect(typeof message.createdAt).toBe('object');
      expect(message.authorName).toBe(authorName);
      expect(message.messageText).toBe(messageText);
      expect(message.authorId).toBe(authorId);
      expect(message.isCustom).toBe(isCustom);
    });
  
    it('should handle string with only whitespace', () => {
      const authorName = '   ';
      const messageText = '   ';
      const authorId = '   ';
      const isCustom = false;
  
      const message = generateMessage(authorName, messageText, authorId, isCustom);
  
      expect(typeof message.createdAt).toBe('object');
      expect(message.authorName).toBe(authorName);
      expect(message.messageText).toBe(messageText);
      expect(message.authorId).toBe(authorId);
      expect(message.isCustom).toBe(isCustom);
    });
  
    it('should handle string with special characters', () => {
      const authorName = '!@#$%^&*()';
      const messageText = '!@#$%^&*()';
      const authorId = '!@#$%^&*()';
      const isCustom = false;
  
      const message = generateMessage(authorName, messageText, authorId, isCustom);
  
      expect(typeof message.createdAt).toBe('object');
      expect(message.authorName).toBe(authorName);
      expect(message.messageText).toBe(messageText);
      expect(message.authorId).toBe(authorId);
      expect(message.isCustom).toBe(isCustom);
    });
  });