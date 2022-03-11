const Reservation_intermediaire = require('../models/FrontOffice/reservation_intermediaire.js');
const jwt = require('jsonwebtoken');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
var fs = require('fs');
var path = require('path')
const multer = require('multer');

let folder= path.join(__dirname,'../../light-bootstrap-dashboard-react-master/public/factures');

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


// Super Admin Afficher list des Reservation_intermediaires

let ListReservation_intermediaire_payer = async function(req, res, next) {
   
    await  Reservation_intermediaire.getAllReservation_intermediaire( function (err, Reservation_intermediaires) {
        if(err) return next(err);
        if (Reservation_intermediaires.length < 1) {
            return res.status(404).json({ message: "Reservation intermediaires pas trouvé" })
        }
            res.json({ Reservation_intermediaires: Reservation_intermediaires })
        });
  
}

let ListDemande_intermediaire = async function(req, res, next) {
   
    await  Reservation_intermediaire.getAllDemande_intermediaire( function (err, demande_intermediaires) {
        if(err) return next(err);
        if (demande_intermediaires.length < 1) {
            return res.status(404).json({ message: "Demande intermediaires pas trouvé" })
        }
            res.json({ demande_intermediaires: demande_intermediaires })
        });
  
}

// Add Reservation_intermediaire Agence
let AddReservation_intermediaire = function (req, res, next) {
    const { Nom_complete, date, email, menu, Nombre_personne, Boisson,intermediaire} = req.body;
    var newReservation_intermediaire = new Reservation_intermediaire({
       Nom_complete: Nom_complete,
       date: date,
       email: email,
       menu:menu,
       Nombre_personne:Nombre_personne,
       Boisson: Boisson,
       intermediaire:intermediaire
    });

    Reservation_intermediaire.createReservation_intermediaire(newReservation_intermediaire, function (err, Reservation_intermediaire) {
       if (err) return next(err);
        //send 
        res.json({ message: 'Reservation intermediare créé' })
            });

}

// get Reservation_intermediaire by id 
let Reservation_intermediaireById = async function(req, res, next) {
    let { id }= req.params;
     await  Reservation_intermediaire.getReservation_intermediaireById(id ,function (err, Reservation_intermediaire) {
        if(err) return next(err);
             res.json({ Reservation_intermediaire: Reservation_intermediaire })
         });
   
 }
 /////////////////////////Updates//////////////////////////


  
 
  const url = 'http://localhost:3002';
// upload facture Caissier 
let uploadFacture = async function (req, res, next) {
            let {id}= req.params;
            let {status, present}= req.body;
            console.log(req.file.filename);
             let Reservation_intermediaireUpdate = {
                facture_upload:  req.file.filename
             };
             if(status=="Accept" && present=="Oui"){
                await Reservation_intermediaire.uploadFacture(id, Reservation_intermediaireUpdate,function (err, Reservation_intermediaire){
                 if (err) return next(err);
                     //send 
                     res.json({ message: 'ticket de Reservation intermediare mise à jour' })
                         });
            } else {
                res.json({ message: 'ticket de Reservation intermediare ne pas télécharger ' })
            }
}
 

 
// Admin update status de Reservation_intermediaire (Accept, Refuser, Annuler)

let UpdateStatusReservation_intermediaireByAdmin = async function(req, res, next) {
    const {id, date, status} = req.body;
let updateStatus = {
        status:status
    };
    await  Reservation_intermediaire.findAndUpdateStatus(id, updateStatus, function (err, Reservation_intermediaires) {
       if (err) return next(err);
       
            res.json({ message: 'status Reservation intermediare modified' })
            });
}

// Caissier update status Present ou Non de Reservation_intermediaire

let UpdateStatusPresentByCaissier = async function(req, res, next) {
    const { Agence, date, status, present} = req.body;
    let {id} = req.params;
    let updatePresent= {
       present: present
    };
    if(status=="Accept"){
    await  Reservation_intermediaire.findAndUpdateStatusPresent(id, updatePresent, function (err, Reservation_intermediaires) {
       if (err) return next(err);
       
            res.json({ message: 'Reservation_intermediaire status present modified' })
        });
    } else {
        res.json({ message: 'Reservation_intermediaire ne pas modifié' })
    }
}

// Caissier update prix total de Reservation_intermediaire

let UpdatePrixTotalReservation_intermediaireByCaissier = async function(req, res, next) {
    const {Agence, date, status, prix_Total, present} = req.body;
    let {id} = req.params;
    let updatePrixTotal= {
        prix_Total: prix_Total
    };
    if(status == "Accept" && present == "Oui"){
        await  Reservation_intermediaire.findAndUpdatePrixTotal(id, updatePrixTotal, function (err, Reservation_intermediaires) {
            if (err) return next(err);
              res.json({ message: 'prix total de Reservation intermediare modified' })
            });
    } else {
        res.json({ message: 'cette Reservation intermediare ne pas modifié !' })
    }
}


// Admin update status Payer de Reservation_intermediaire

let UpdateStatusPayerByAdmin = async function(req, res, next) {
    const { id, date, status, payer_status, present} = req.body;
    let updateStatusPayer= {
       payer_status: payer_status,
       date: Date.now
    };
    if(status == "Accept" && present == "Oui"){
    await  Reservation_intermediaire.findAndUpdatePayerStatus(id, updateStatusPayer, function (err, Reservation_intermediaires) {
       if (err) return next(err);
       
            res.json({ message: 'status payer Reservation intermediare modified' })
        });
    } else {
        res.json({ message: 'status payer Reservation intermediare ne pas modifier' })
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
    await  Reservation_intermediaire.findAndUpdateComition(id, updateComition, function (err, reservations) {
       if (err) return next(err);
            res.json({ message: 'reservation comition modifié' })
        });
}

//  Caissier Admin Afficher list des reservations status Accept

let ListReservationIntermediaireAccept = async function(req, res, next) {
   
    await  Reservation_intermediaire.getAllIntermediaireAccept( function (err, reservation_intermediaires) {
        if (reservation_intermediaires.length < 1) {
            return res.status(404).json({ message: "liste reservations pas trouvé" })
        }
            res.json({ Reservation_intermediaires: reservation_intermediaires })
        });
  
}

// Afficher les reservation  Payer in intermediaire
let ReservationIntermediairewithPayerStatus = async function (req, res, next) {
    const {id} = req.params;
        await  Reservation_intermediaire.getReservationByIntermediaire(id, function (err, reservations) {
           if (err) return next(err);
           
            if (reservations.length < 1) {
                return res.status(404).json({ message: "reservations pas trouvé" })
            }
                res.json({ Reservation_intermediaires: reservations })
                });
    
    }
  module.exports = {
      AddReservation_intermediaire,  UpdateStatusReservation_intermediaireByAdmin, UpdatePrixTotalReservation_intermediaireByCaissier, ListReservation_intermediaire_payer, Reservation_intermediaireById, UpdateStatusPresentByCaissier, showImageSingle, uploadFacture, UpdateStatusPayerByAdmin, UpdateComitionByCaissier , ReservationIntermediairewithPayerStatus, ListDemande_intermediaire, ListReservationIntermediaireAccept
  }