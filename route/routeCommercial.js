const express= require('express');
const Commercial= require('../controllers/Commercial.Controller.js');
const route = express.Router();
route.post("/Commercial/register",Commercial.RegisterCommercial);
route.post("/Commercial/login",Commercial.Login);
module.exports=route;