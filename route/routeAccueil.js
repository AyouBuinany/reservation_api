const express= require('express');
const Accueil= require('../controllers/Accueil.Controller.js');
const route = express.Router();
route.post("/accueil/add_reservation",Accueil.AddReservation);
route.post("/accueil/update_reservation",Accueil.UpdateReservation);
route.get("/accueil/list_reservation",Accueil.ListReservation);
route.get("/accueil/reservation/:id", Accueil.getReservationById);
//caissier
route.get("/caissier/reservation/:id", Accueil.getReservationById);
route.post("/caissier/update_reservation",Accueil.showImageSingle, Accueil.updateReservationComition)
route.get("/caissier/reservations", Accueil.ListReservationsByComition);

// partenaire
route.post("/partenaire/add_reservation",Accueil.AddReservation);
route.get("/partenaire/reservations/:id", Accueil.ListReservationsByPartenaire);
module.exports=route;