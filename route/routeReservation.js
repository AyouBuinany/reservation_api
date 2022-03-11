const express= require('express');
const Reservation= require('../controllers/Reservation.Controller.js');
const route = express.Router();

route.post("/Reservation/AddReservation",Reservation.AddReservation);

route.get("/Reservation/list",Reservation.ListReservation);


route.put("/Reservation/updatePrix/:id", Reservation.UpdatePrixTotalReservationByCaissier);

route.put("/Reservation/updateStatus/:id", Reservation.UpdateStatusReservationByAdmin);

route.post("/Reservation/uploadFacture/:id", Reservation.showImageSingle, Reservation.uploadFacture );

route.put("/Reservation/updateStatusPresent/:id", Reservation.UpdateStatusPresentByCaissier);

route.put("/Reservation/updateStatusPayer/:id", Reservation.UpdateStatusPayerByAdmin);

route.put("/Reservation/updateComition/:id", Reservation.UpdateComitionByCaissier);

route.get("/Reservation/byAgence/:id",Reservation.ReservationAgencewithPayerStatus);

route.get("/Reservation/getReservation/:id",Reservation.ReservationById);

route.get("/Reservation/count/:id", Reservation.GetCountReservationByAgence);

module.exports=route;