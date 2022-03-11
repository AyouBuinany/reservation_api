const express= require('express');
const Agence= require('../controllers/Agence.Controller.js');
const route = express.Router();
route.post("/Agence/register",Agence.RegisterAgence);
route.post("/Agence/login",Agence.Login);
route.get("/Agence/Commercial/:id", Agence.ListAgenceByCommercial);
route.get("/Admin/Agence/:id",Agence.ListAgenceByAdmin);
route.get("/agence/:id",Agence.AgenceById);
module.exports=route;