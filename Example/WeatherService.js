
import * as axios from "axios";
import LocationService from './LocationService'

export class WeatherService {
  constructor() {
    this.cache = new Map();
    this.locationService = new LocationService();
  }

  async getWeather(city) {
    if (this.cache.has(city)) {
      return this.cache.get(city);
    }

    const location = await this.locationService.getCoordinates(city);
    const response = await axios.get(`https://api.weather.com/v3/weather/forecast?lat=${location.lat}&lon=${location.lon}`);

    const weatherData = response.data;
    this.cache.set(city, weatherData);
    return weatherData;
  }

  clearCache() {
    this.cache.clear();
  }
}
