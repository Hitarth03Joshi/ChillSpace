const UserController = require('../controllers/UserController');
const multer = require("multer");
const routes = require('express').Router();

const storage = multer.diskStorage({
  destination:"./uploads",
  filename: function (req,file,cb){
    console.log("Hi");
      cb(null,file.originalname);
  }
});

const upload = multer({
  storage:storage
})


routes.post('/register',upload.single('image'), UserController.addUser);
routes.post('/login', UserController.loginUser);
routes.delete('/delete/:id', UserController.deleteUser);
routes.get('/getallhost', UserController.getAllHosts);
routes.get('/get/:id', UserController.getUserById);
routes.get('/get', UserController.getUsers);

module.exports = routes;