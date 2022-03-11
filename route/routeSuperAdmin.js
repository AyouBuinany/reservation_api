const express= require('express');
const SuperAdmin= require('../controllers/SuperAdmin.Controller.js');
const route = express.Router();
route.post("/SuperAdmin/register",SuperAdmin.RegisterSuperAdmin);
route.post("/SuperAdmin/login",SuperAdmin.Login);

module.exports=route;