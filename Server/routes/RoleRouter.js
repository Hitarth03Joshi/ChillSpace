const routes = require('express').Router()
const roleController = require("../controllers/RoleController")

routes.get("/getrole",roleController.getRole)
routes.post("/addrole",roleController.addRole)

module.exports=routes