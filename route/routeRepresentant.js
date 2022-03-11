const express= require('express');
const Representant= require('../controllers/Representant.Controller.js');
const route = express.Router();

route.post("/Representant/register",Representant.RegisterRepresentant);

route.post("/Representant/login",Representant.Login);

route.get("/Representant/agence/:id", Representant.getRepresentantByAgence);

route.get("/Representant/commercial/:id", Representant.getRepresentantByCommercial);

route.get("/Representant/admin/:id", Representant.getRepresentantByAdmin);
module.exports=route;