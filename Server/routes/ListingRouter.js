const routes = require('express').Router();
const listingController = require('../controllers/ListingController');

routes.post('/create', listingController.addListing);
routes.get('/getalllisting', listingController.getAllListings);
routes.get('/category', listingController.getListingByCategory);
routes.get('/search/:search', listingController.getBySearch);
routes.get('/:listingId', listingController.listingDetail);
routes.put('/updatelisting/:listingId', listingController.updateListing);
routes.delete('/delete/:listingId', listingController.deleteListing);

module.exports = routes;