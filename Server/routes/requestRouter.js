const routes = require('express').Router();
const requestController = require('../controllers/requestController');

routes.post('/add', requestController.addRequest);
routes.get('/all', requestController.getAllRequests);
routes.get('/get/:id', requestController.getRequestById);
routes.patch('/update/:id', requestController.updateRequest);
routes.delete('/delete/:id', requestController.deleteRequest);

module.exports = routes;
// Compare this snippet from Server/controllers/requestController.js: