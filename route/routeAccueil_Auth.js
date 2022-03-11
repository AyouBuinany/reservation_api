const express= require('express');
const Accueil= require('../controllers/Accueil_auth.Controller.js');
const route = express.Router();
route.post("/accueil/register",Accueil.RegisterAccueil);
route.post("/accueil/login",Accueil.Login);
module.exports=route;