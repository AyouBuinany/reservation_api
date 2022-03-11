const express= require('express');
const intermediaire= require('../controllers/Intermediaire.Controller.js');
const route = express.Router();
route.post("/intermediaire/register",intermediaire.Registerintermediaire);
route.post("/intermediaire/login",intermediaire.Login);
route.get("/intermediaire/:id",intermediaire.IntermediaireById);
module.exports=route;