const express= require('express');
const Caissier= require('../controllers/Caissier.Controller.js');
const route = express.Router();
route.post("/Caissier/register",Caissier.RegisterCaissier);
route.post("/Caissier/login",Caissier.Login);

module.exports=route;