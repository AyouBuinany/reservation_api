
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var ReservationAgenceSchema = mongoose.Schema({
    Id_representant : {
        type: String,
    },
    Nom_Groupe: {
        type : String,
        require:true
    },
    date: {
            type:Date,
            default:Date.now
    },
    menu: {
        type: Array,
        default : []
    },
    Nombre_personne: {
        type: Number,
        require: true
    },
    Boisson: {
        type : Array,
       default: []
    }
    ,
    Agence :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agence'
    },
    prix_Total : {
        type: Number,
        default:0,
    },
    payer_status: {
        type : String,
        default:'Non',
        enum: ['Oui','Non']
    },
    status : {
        type: String,
        default: "EnAttande",
        enum: ['EnAttande', 'Accept', 'Refuser', 'Annuler']
    },
    present : {
        type: String,
        default: "Non",
        enum: ['Oui','Non']

    },
    facture_upload : {
        type: String
    },
    comition:{
        type:Number,
        default:0
    },
    accueil :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accueil'
    },
});

var Reservation = module.exports = mongoose.model('Reservation_agence', ReservationAgenceSchema);
// create reservation (Agence, individuel)
module.exports.createReservation = function (newReservation, callback) {
    
    newReservation.save(callback);
}
// get one reservation by id
module.exports.getReservationById = function (id, callback) {
    Reservation.findById(id, callback);
}

 // update comition caissier
 module.exports.findAndUpdateComition = function(id, newComition, callback) {
    Reservation.findByIdAndUpdate(id, {$set:newComition}, callback);
  }
//get all Reservation by Agence
module.exports.getReservationByAgence = function (id, callback) {
    var query = {Agence : id, payer_status : 'Non' };
    Reservation.find(query, callback);
}

//get all Reservation Agence by admin
module.exports.getAllReservationAgenceByAdmin = function (id, callback) {
    var query = {Agence : id, payer_status : 'Non' };
    Reservation.find(query, callback);
}
// update Reservation 
module.exports.updateReservation = function(id,ReservationUpdate,callback) {
  Reservation.findByIdAndUpdate(id,{$set:ReservationUpdate},callback);
}
// update Reservation  (upload facture) Caissier
module.exports.uploadFacture = function(id,reservationUpdate,callback) {
    Reservation.findByIdAndUpdate(id,{$set:reservationUpdate},callback);
  }
// update payer Status Admin and commercial
module.exports.findAndUpdatePayerStatus = function(id,newPayerStatus,callback) {
    Reservation.findByIdAndUpdate(id,{$set:newPayerStatus},callback);
  }
// update prix total caissier
  module.exports.findAndUpdatePrixTotal = function(id, newPrixTotal, callback) {
    Reservation.findByIdAndUpdate(id, {$set:newPrixTotal}, callback);
  }


  // update status (Accept, refuser, annuller) Admin et commercial 
  module.exports.findAndUpdateStatus = function(id,newStatus,callback) {
    Reservation.findByIdAndUpdate(id, {$set:newStatus},callback);
  }

   // update status present ou non caissier 
   module.exports.findAndUpdateStatusPresent = function(id,newStatusPresent,callback) {
    Reservation.findByIdAndUpdate(id, {$set:newStatusPresent},callback);
  }
// get all reservation SuperAdmin
module.exports.getAllReservation = function (callback) {
    Reservation.find(callback);
}

// Nombre reservation de agence 
module.exports.getNombreReservations = function (id, callback) {
    Reservation.count({Agence : id},callback);
}




