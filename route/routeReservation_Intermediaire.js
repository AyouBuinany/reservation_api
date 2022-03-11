const express= require('express');
const Reservation_intermediaire= require('../controllers/Reservation_intermediaire.Controller.js');
const route = express.Router();

route.post("/Reservation_intermediaire/AddReservation_intermediaire",Reservation_intermediaire.AddReservation_intermediaire);

route.get("/Reservation_intermediaire/listPayer",Reservation_intermediaire.ListReservation_intermediaire_payer);

route.get("/Demandes_intermediaire/list",Reservation_intermediaire.ListDemande_intermediaire);

route.get("/Reservation_intermediaire/list",Reservation_intermediaire.ListReservationIntermediaireAccept);

route.get("/Reservation_intermediaire/:id", Reservation_intermediaire.ReservationIntermediairewithPayerStatus)

route.put("/Reservation_intermediaire/updatePrix/:id", Reservation_intermediaire.UpdatePrixTotalReservation_intermediaireByCaissier);

route.put("/Reservation_intermediaire/updateStatus", Reservation_intermediaire.UpdateStatusReservation_intermediaireByAdmin);

route.post("/Reservation_intermediaire/uploadFacture/:id", Reservation_intermediaire.showImageSingle, Reservation_intermediaire.uploadFacture );

route.put("/Reservation_intermediaire/updateStatusPresent/:id", Reservation_intermediaire.UpdateStatusPresentByCaissier);

route.put("/Reservation_intermediaire/updateStatusPayer", Reservation_intermediaire.UpdateStatusPayerByAdmin);

route.put("/Reservation/updateComition/:id", Reservation_intermediaire.UpdateComitionByCaissier);

route.get("/Reservation_intermediaire/getReservation_intermediaire/:id",Reservation_intermediaire.Reservation_intermediaireById);


module.exports=route;