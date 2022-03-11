const express= require('express');
const Individeul= require('../controllers/individeul.Controller.js');
const route = express.Router();

route.post("/Individeul/AddReservation",Individeul.AddReservationIndivideul);

route.get("/Individeul/reservation/list",Individeul.ListReservationIndivideul);

route.get("/Individeul/demande/list",Individeul.ListDemandeIndividuels);

route.put("/Individeul/updateStatus", Individeul.UpdateStatusReservationByAdmin);

route.put("/Individeul/updatePrix/:id", Individeul.UpdatePrixTotalReservationByCaissier);

route.post("/Individeul/uploadFacture/:id", Individeul.showImageSingle, Individeul.uploadFacture );

route.put("/Individeul/updateStatusPresent/:id", Individeul.UpdateStatusPresentByCaissier);

route.put("/Individeul/updateStatusPayer/:id", Individeul.UpdateStatusPayerByAdmin);

route.put("/Individeul/updateComition/:id", Individeul.UpdateComitionByCaissier);

route.get("/Individeul/getReservation",Individeul.ReservationById);

route.get("/Individuel/list/accept", Individeul.ListReservationIndivideulAccept);

module.exports=route;