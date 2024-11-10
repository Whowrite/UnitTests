import { WeatherService } from './WeatherService.js';
import LocationService from './LocationService.js';
import axios from 'axios';

//Мокаємо бібліотеки чи файли з класами.
jest.mock("axios");
jest.mock("./LocationService.js")

describe('WeatherService', () => {
  let weatherService;
  let locationServiceMock;

  beforeEach(() => {
    locationServiceMock = new LocationService();
    weatherService = new WeatherService();
    weatherService.locationService = locationServiceMock; // Підміняємо реальний клас з конструктора на мок
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches weather data for a given city and caches the result', async () => {
    // Змінюємо данні що будуть поверненні з моків.
    locationServiceMock.getCoordinates.mockResolvedValue({ lat: 40.7128, lon: -74.006 });
    axios.get.mockResolvedValue({ data: { temperature: 25 } });

    const result = await weatherService.getWeather('New York');
    
    // Перевіряємо виклик методу getWeather
    expect(result).toEqual({ temperature: 25 });

    // Перевіряємо що внутрішні методи були викликані з правильними параметрами
    expect(locationServiceMock.getCoordinates).toHaveBeenCalledWith('New York');
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('lat=40.7128&lon=-74.006'));

    // Перевіряємо що значення було записане в кеш
    expect(weatherService.cache.get('New York')).toEqual({ temperature: 25 });
  });

  it('returns cached data on subsequent calls for the same city', async () => {

    weatherService.cache.set('Los Angeles', { temperature: 30 });

    const result = await weatherService.getWeather('Los Angeles');
    expect(result).toEqual({ temperature: 30 });

    expect(locationServiceMock.getCoordinates).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('clears cache when clearCache is called', () => {
    weatherService.cache.set('Chicago', { temperature: 15 });
    weatherService.clearCache();

    expect(weatherService.cache.size).toBe(0);
  });
});
