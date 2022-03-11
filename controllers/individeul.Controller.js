const Individuel = require('../models/FrontOffice/R_Individuel.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var path = require('path')
const multer = require('multer');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')


let folder= path.join(__dirname,'../../FrontEnd/my-app/public/factures');

const storage = multer.diskStorage({
 
    destination: (req, file, cb) => {
       cb(null,  path.join(folder ,'/individuel'))
        },
    filename: (req, file, cb) => {
        
                //cb(null,new Date().toISOString() + file.originalname);
                cb(null, new Date().toISOString().replace(/:/g,'-')+ file.originalname)
            }
  
  });
  const fileFilter=(req, file, cb)=>{
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "application/pdf" ) {
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

let ListReservationIndivideul = async function(req, res, next) {
   
    await  Individuel.getAllIndividuel( function (err, individeuls) {
        if (individeuls.length < 1) {
            return res.status(404).json({ message: "liste reservations pas trouvé" })
        }
            res.json({ individeuls: individeuls })
        });
  
}

//  Caissier Admin Afficher list des reservations status Accept

let ListReservationIndivideulAccept = async function(req, res, next) {
   
    await  Individuel.getAllIndividuelAccept( function (err, individuels) {
        if (individuels.length < 1) {
            return res.status(404).json({ message: "liste reservations pas trouvé" })
        }
            res.json({ individuels: individuels })
        });
  
}

// Add reservation Individeul
let AddReservationIndivideul = function (req, res, next) {
    const { Nom_complete, email, telephone, date, heure, Nombre_personne, message, status, facture_upload} = req.body;
    const { error } = validation.registerValidationIndivideul(telephone.credential);
    if(error){
        console.log({error});
        let err = ErrorHandler('Add Individeul error', 400, 'missing_field', { message: error.details[0].message })
        return next(err)
    }
    var newReservation = new Individuel({
        Nom_complete: Nom_complete,
        email: email,
        telephone: telephone,
        date_reservation: date,
        heure: heure,
        Nombre_personne: Nombre_personne,
        message: message
    });

       Individuel.createIndividuel(newReservation, function (err, reservation) {
       if (err) return next(err);
        //send 
        res.json({ message: 'reservation crée' })
            });

}


// get reservation by id 
let ReservationById = async function(req, res, next) {
    let { id }= req.params;
     await  Individuel.getIndividuelById(id ,function (err, reservation) {
         if (reservation.length < 1) {
             return res.status(404).json({ message: "reservation pas trouvé" })
         }
             res.json({ individeul: reservation })
         });
   
 }
 /////////////////////////Updates//////////////////////////


  
 
  const url = 'http://localhost:3001';
// upload facture Caissier 
let uploadFacture = async function (req, res, next) {
            let {id}= req.params;
            let {status, present, }= req.body;
             let reservationUpdate = {
                facture_upload:  req.file.filename,
             };
            if( present == "Oui"){
                await Individuel.uploadFacture(id, reservationUpdate,function (err, reservation){
                 if (err) return next(err);
                     //send 
                     res.json({ message: 'facture reservation modifié' })
                });
             } else {
                 res.json({ message: 'facture reservation ne pas upload ' })
             }
}
 

 
// Admin update status de reservation (Accept, Refuser, Annuler)

let UpdateStatusReservationByAdmin = async function(req, res, next) {
    const { id, date, status} = req.body;
let updateStatus = {
        status:status
    };
    await  Individuel.findAndUpdateStatus(id, updateStatus, function (err, reservations) {
       if (err) return next(err);
        res.json({ message: 'reservation status modifié' })
    });
}

// Caissier update status Present ou Non de reservation

let UpdateStatusPresentByCaissier = async function(req, res, next) {
    const { date, status, present} = req.body;
    let {id} = req.params;
    let updatePresent= {
       present: present,
    };
    await  Individuel.findAndUpdateStatusPresent(id, updatePresent, function (err, reservations) {
       if (err) return next(err);
            res.json({ message: 'reservation status present modifié' })
        });
}

// Caissier update status Present ou Non de reservation

let UpdateComitionByCaissier = async function(req, res, next) {
    const {comition} = req.body;
    let {id} = req.params;
    let updateComition= {
        comition: comition,
    };
    await  Individuel.findAndUpdateComition(id, updateComition, function (err, individuel) {
       if (err) return next(err);
            res.json({ message: 'reservation comition modifié' })
        });
}

// Caissier update prix total de reservation individeul

let UpdatePrixTotalReservationByCaissier = async function(req, res, next) {
    const {date, status, prix_Total, present} = req.body;
    let {id} = req.params;
    let updatePrixTotal= {
        prix_Total: prix_Total
    };
        await  Individuel.findAndUpdatePrixTotal(id, updatePrixTotal, function (err, reservations) {
            if (err) return next(err);
              res.json({ message: 'reservation prix total modified' })
            });
}


// Admin update status Payer de reservation

let UpdateStatusPayerByAdmin = async function(req, res, next) {
    const {id, date, status, payer_status, present} = req.body;
    let updateStatusPayer= {
       payer_status: payer_status
    };
    if(present == "Oui" ){
    await  Individuel.findAndUpdatePayerStatus(id, updateStatusPayer, function (err, reservations) {
       if (err) return next(err);
       
            res.json({ message: 'reservation status payer modified' })
        });
    } else {
        res.json({ message: 'status reservation ne pas Accepter' })
    }
}



//
// Super Admin Afficher list des reservations

let ListReservations = async function(req, res, next) {
   
    await  Individuel.getAllIndividuels( function (err, reservations) {
        if (reservations.length < 1) {
            return res.status(404).json({ message: "reservations pas trouvé" })
        }
            res.json({ reservation_individuels: reservations })
        });
  
}

let ListDemandeIndividuels = async function(req, res, next) {
   
    await  Individuel.getAllDemandeIndividuels( function (err, demandes) {
        if (demandes.length < 1) {
            return res.status(404).json({ message: "demandes de reservations pas trouvé" })
        }
            res.json({ demande_individuels: demandes })
        });
  
}
//

  module.exports = {
    AddReservationIndivideul, UpdateStatusReservationByAdmin, UpdatePrixTotalReservationByCaissier, ListReservations, ListDemandeIndividuels, ReservationById, UpdateStatusPresentByCaissier, showImageSingle, uploadFacture, UpdateStatusPayerByAdmin, ListReservationIndivideul, ListReservationIndivideulAccept, UpdateComitionByCaissier
  }