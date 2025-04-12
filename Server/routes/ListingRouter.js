const routes = require('express').Router();
const listingController = require('../controllers/ListingController');

routes.post('/create', listingController.addListing);
routes.get('/getalllisting', listingController.getAllListings);
routes.get('/', listingController.getListingByCategory);
routes.get('/search/:search', listingController.getBySearch);
routes.get('/:listingId', listingController.listingDetail);
routes.put('/updatelisting/:listingId', listingController.updateListing);

module.exports = routes;