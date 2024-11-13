import axios from 'axios';
import UserService from './UserService';
import NotificationService from './NotificationService';

jest.mock('axios');
jest.mock('./NotificationService');

describe('UserService', () => {
  let userService;
  const userId = '123';
  const mockUserData = { id: userId, name: 'John Doe' };

  beforeEach(() => {
    userService = new UserService();
    axios.get.mockReset();
    NotificationService.mockClear();
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Мокаємо console.log
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Відновлюємо початкову реалізацію console.log після кожного тесту
  });

  it('should return user data from cache or fetch it from API and send a welcome message', async () => {
    // Перевіряємо спочатку кеш
    userService.cache[userId] = mockUserData;  // Встановлюємо дані в кеш
    const cachedData = await userService.getUserData(userId);

    expect(cachedData).toEqual(mockUserData);
    expect(axios.get).not.toHaveBeenCalled(); // Перевіряємо, що запит не був виконаний

    // Тепер тестуємо API запит (очищаємо кеш для нового запиту)
    userService.clearCache();  // Очищаємо кеш перед тестом API

    axios.get.mockResolvedValueOnce({ data: mockUserData });  // Мокаємо API запит
    const dataFromApi = await userService.getUserData(userId);

    expect(dataFromApi).toEqual(mockUserData);
    expect(axios.get).toHaveBeenCalledWith(`https://api.example.com/users/${userId}`);  // Перевіряємо, що API було викликано

    // Перевіряємо, що повідомлення було відправлене
    const sendWelcomeMessageMock = jest.spyOn(userService.notificationService, 'sendWelcomeMessage');
    await userService.getUserData(userId);

    expect(sendWelcomeMessageMock).toHaveBeenCalledWith(userId, mockUserData.name);

    // Перевірка console.log
    //expect(console.log).toHaveBeenCalledWith(`Welcome message sent to ${mockUserData.name} (ID: ${userId})`);

    // Перевірка кешу
    expect(userService.cache[userId]).toEqual(mockUserData);
  });

  it('should clear the cache when clearCache is called', () => {
    userService.cache[userId] = mockUserData;
    userService.clearCache();
    expect(userService.cache).toEqual({});
  });
});