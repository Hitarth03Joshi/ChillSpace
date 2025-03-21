const UserController = require('../controllers/UserController');
const routes = require('express').Router();

routes.post('/register', UserController.addUser);
routes.post('/login', UserController.loginUser);
routes.delete('/delete/:id', UserController.deleteUser);
routes.get('/get/:id', UserController.getUser);
routes.get('/get', UserController.getUsers);

module.exports = routes;