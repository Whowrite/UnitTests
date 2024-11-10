import axios from 'axios';
import NotificationService from './NotificationService.js';

class UserService {
  constructor() {
    this.cache = {};
    this.notificationService = new NotificationService();
  }

  async getUserData(userId) {
    if (this.cache[userId]) {
      return this.cache[userId];
    }

    const response = await axios.get(`https://api.example.com/users/${userId}`);
    const userData = response.data;

    this.cache[userId] = userData;

    await this.notificationService.sendWelcomeMessage(userId, userData.name);

    return userData;
  }

  clearCache() {
    this.cache = {};
  }
}

export default UserService;
