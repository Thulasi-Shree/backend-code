
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const axios = require('axios');
const geolib = require('geolib');

const userLocation = catchAsyncError(async  (req, res) => {
    try {
        // Use httpbin to get a sample IP address
        const response = await axios.get('https://httpbin.org/ip');
        const ipAddress = response.data.origin;
    
        // Use the sample IP address to get location data
        const ipInfoResponse = await axios.get(`http://ipinfo.io/${ipAddress}/json`);
        const { loc } = ipInfoResponse.data;
    
        const [latitude, longitude] = loc.split(',').map(parseFloat);
    
        res.json({ latitude, longitude });
      } catch (error) {
        console.error('Error getting user location:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  
  // Endpoint to calculate distance between user and restaurant
  const calculateDistance = catchAsyncError(async (req, res, next) => {
    try {
      // Get user's location from the request body
      const { latitude: userLatitude, longitude: userLongitude } = req.body;
  
      // Get restaurant's location (assuming you have obtained it previously)
    //   const restaurantLocation = { latitude: 12.8788, longitude: 80.2260 }; 
    const restaurantLocation = { latitude: 12.8280321, longitude: 80.7109604 }; 

    // const restaurantLocation = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=31bc2a8978644190beec0a6f143266d3`);

      // Check if the user location is provided in the request body
      if (!userLatitude || !userLongitude) {
        return res.status(400).json({ error: 'User location not provided in the request body' });
      }
  
      // Calculate distance in meters
      const distanceInMeters = geolib.getDistance(
        { latitude: userLatitude, longitude: userLongitude }, 
        restaurantLocation
      );
  
      // Convert distance to kilometers
      const distanceInKilometers = distanceInMeters / 1000;
  
      res.json({ distanceInMeters, distanceInKilometers });
    } catch (error) {
      console.error('Error calculating distance:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = calculateDistance;
  const addressDatabase = {
    '1600 Amphitheatre Parkway, Mountain View, CA': { latitude: 37.422, longitude: -122.084 },
    '1 Infinite Loop, Cupertino, CA': { latitude: 37.3318, longitude: -122.0311 },
    // Add more addresses and corresponding coordinates as needed
  };  
  const geoCoading = catchAsyncError(async(req, res) => {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required in the request body' });
    }
  
    const normalizedAddress = address.toLowerCase();
    const result = addressDatabase[normalizedAddress];
  
    if (result) {
      res.json({ coordinates: result });
    } else {
      res.status(404).json({ error: 'Coordinates not found for the given address' });
    }
  });
  
  module.exports = {
    calculateDistance,
    userLocation,
    geoCoading
};
