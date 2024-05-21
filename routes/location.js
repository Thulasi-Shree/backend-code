const express = require('express');
const locationController = require('../controllers/location/location');
const geoLocationController = require('../controllers/location/geoLocation')
const geoaplify = require('../controllers/apiKey/locationKey')

const router = express.Router();

// Update Location by ID: PUT /api/locations/:id
router.put('/locations/:id', locationController.updateLocation);

// Delete Location by ID: DELETE /api/locations/:id
router.delete('/locations/:id', locationController.deleteLocation);

// Save User Location: POST /api/user-location
router.post('/user-location', locationController.saveUserLocation);
router.get('/locationApikey', geoaplify.locationApikey);

// Get Nearby Restaurants by Latitude and Longitude: GET /api/restaurants/:latitude/:longitude
router.get('/restaurants/:latitude/:longitude', locationController.getNearbyRestaurants);

router.post('/calculate-distance', geoLocationController.calculateDistance);
router.get('/user-location', geoLocationController.userLocation); 
router.post('/geocode', geoLocationController.geoCoading); 

module.exports = router;
