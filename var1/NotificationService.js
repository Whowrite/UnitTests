class NotificationService {
    async sendWelcomeMessage(userId, userName) {
      console.log(`Welcome message sent to ${userName} (ID: ${userId})`);
    }
  }
  
  export default NotificationService;
  