const express= require('express');
const Partenaire= require('../controllers/Partenaire.Controller.js');
const route = express.Router();
route.post("/partenaire/register", Partenaire.showImageSingle, Partenaire.RegisterPartenaire);
route.post("/partenaire/login",Partenaire.Login);
route.get("/partenaire/information/:id", Partenaire.getPartenaireById);
module.exports=route;