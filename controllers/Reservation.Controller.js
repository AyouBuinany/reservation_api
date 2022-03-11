const Reservation = require('../models/FrontOffice/Reservation_agence.js');
const jwt = require('jsonwebtoken');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
var fs = require('fs');
var path = require('path')
const multer = require('multer');

let folder= path.join(__dirname,'../../FrontEnd/my-app/public/factures');

const storage = multer.diskStorage({
 
    destination: (req, file, cb) => {
       cb(null,  path.join(folder ,'/agence'))
        },
    filename: (req, file, cb) => {
        
                //cb(null,new Date().toISOString() + file.originalname);
                cb(null, new Date().toISOString().replace(/:/g,'-')+ file.originalname)
            }
  
  });
  const fileFilter=(req, file, cb)=>{
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png"  || file.mimetype === "application/pdf") {
        cb(null, true)
    } else {
        cb({message:'STP rentrez une image!'}, false)
    }
}

var upload = multer();
  var upload = multer({
    storage: storage,
     limits: {
        fieldSize: 1024 * 1024 * 5
     },
    fileFilter: fileFilter
    
});
//Upload Single Image
  let showImageSingle = upload.single('facture_upload');


// Super Admin Afficher list des reservations

let ListReservation = async function(req, res, next) {
   
    await  Reservation.getAllReservation( function (err, reservations) {
        if(err) return next(err);
        if (reservations.length < 1) {
            return res.status(404).json({ message: "reservations pas trouvé" })
        }
            res.json({ reservations: reservations })
        });
  
}

// Add reservation Agence
let AddReservation = function (req, res, next) {
    const { Id_representant, Nom_Groupe, date, email, menu, Nombre_personne, Boisson, Agence, prix_Total, payer_status, status, present, facture_upload} = req.body;
    var newReservation = new Reservation({
       Id_representant: Id_representant,
       Nom_Groupe: Nom_Groupe,
       date: date,
       email: email,
       menu:menu,
       Nombre_personne:Nombre_personne,
       Boisson: Boisson,
       Agence:Agence,
    });

       Reservation.createReservation(newReservation, function (err, reservation) {
       if (err) return next(err);
        //send 
        res.json({ message: 'reservation créé' })
            });

}

// Afficher les reservation Non Payer in agence
let ReservationAgencewithPayerStatus = async function (req, res, next) {
const {id} = req.params;
    await  Reservation.getReservationByAgence(id, function (err, reservations) {
       if (err) return next(err);
       
        if (reservations.length < 1) {
            return res.status(404).json({ message: "reservations pas trouvé" })
        }
            res.json({ reservations: reservations })
            });

}

// get reservation by id 
let ReservationById = async function(req, res, next) {
    let { id }= req.params;
     await  Reservation.getReservationById(id ,function (err, reservation) {
        if(err) return next(err);
             res.json({ reservation: reservation })
         });
   
 }
 /////////////////////////Updates//////////////////////////


  
 
  const url = 'http://localhost:3001';
// upload facture Caissier 
let uploadFacture = async function (req, res, next) {
            let {id}= req.params;
            let {status, present}= req.body;
            console.log(req.file.filename);
             let reservationUpdate = {
                facture_upload:  req.file.filename
             };
             if(status=="Accept" && present=="Oui"){
                await Reservation.uploadFacture(id, reservationUpdate,function (err, reservation){
                 if (err) return next(err);
                     //send 
                     res.json({ message: 'facture reservation updated' })
                         });
            } else {
                res.json({ message: 'facture reservation ne pas upload ' })
            }
}
 

 
// Admin update status de reservation (Accept, Refuser, Annuler)

let UpdateStatusReservationByAdmin = async function(req, res, next) {
    const {Agence, date, status} = req.body;
    let {id} = req.params;
let updateStatus = {
        status:status
    };
    await  Reservation.findAndUpdateStatus(id, updateStatus, function (err, reservations) {
       if (err) return next(err);
       
            res.json({ message: 'status de reservation modified' })
            });
}

// Caissier update status Present ou Non de reservation

let UpdateStatusPresentByCaissier = async function(req, res, next) {
    const { Agence, date, status, present} = req.body;
    let {id} = req.params;
    let updatePresent= {
       present: present
    };
    if(status=="Accept"){
    await  Reservation.findAndUpdateStatusPresent(id, updatePresent, function (err, reservations) {
       if (err) return next(err);
       
            res.json({ message: 'reservation status present modified' })
        });
    } else {
        res.json({ message: 'reservation ne pas modifié' })
    }
}

// Caissier update prix total de reservation

let UpdatePrixTotalReservationByCaissier = async function(req, res, next) {
    const {Agence, date, status, prix_Total, present} = req.body;
    let {id} = req.params;
    let updatePrixTotal= {
        prix_Total: prix_Total
    };
    if(status == "Accept" && present == "Oui"){
        await  Reservation.findAndUpdatePrixTotal(id, updatePrixTotal, function (err, reservations) {
            if (err) return next(err);
              res.json({ message: 'reservation prix total modified' })
            });
    } else {
        res.json({ message: 'cette reservation ne pas modifié !' })
    }
}


// Admin update status Payer de reservation

let UpdateStatusPayerByAdmin = async function(req, res, next) {
    const { Agence, date, status, payer_status, present} = req.body;
    let {id} = req.params;
    let updateStatusPayer= {
       payer_status: payer_status
    };
    if(status == "Accept" && present == "Oui"){
    await  Reservation.findAndUpdatePayerStatus(id, updateStatusPayer, function (err, reservations) {
       if (err) return next(err);
       
            res.json({ message: 'reservation status payer modified' })
        });
    } else {
        res.json({ message: 'status reservation ne pas Accepter' })
    }
}

//

// Caissier update status Present ou Non de reservation

let UpdateComitionByCaissier = async function(req, res, next) {
    const {comition} = req.body;
    let {id} = req.params;
    let updateComition= {
        comition: comition,
    };
    await  Reservation.findAndUpdateComition(id, updateComition, function (err, reservation) {
       if (err) return next(err);
            res.json({ message: 'reservation comition modifié' })
        });
}

let GetCountReservationByAgence = async function(req, res, next) {
    const {id} = req.params;

    await Reservation.getNombreReservations(id, function(err, nombre) {
        if(err) return next(err);
        res.json({nombre_reservation: nombre});
    });
}
  module.exports = {
      AddReservation, ReservationAgencewithPayerStatus, UpdateStatusReservationByAdmin, UpdatePrixTotalReservationByCaissier, ListReservation, ReservationById, UpdateStatusPresentByCaissier, showImageSingle, uploadFacture, UpdateStatusPayerByAdmin, UpdateComitionByCaissier, GetCountReservationByAgence 
  }