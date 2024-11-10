
class LocationService {
    async getCoordinates(city) {
      const locations = {
        "New York": { lat: 40.7128, lon: -74.0060 },
        "Los Angeles": { lat: 34.0522, lon: -118.2437 },
      };
      return locations[city] || { lat: 0, lon: 0 };
    }
  }
  
  export default LocationService;
  