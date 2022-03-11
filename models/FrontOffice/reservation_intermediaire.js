
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const { string } = require('joi');

var R_intermediareSchema = mongoose.Schema({
    Nom_complete: {
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
    intermediaire:{
        type: String,
    },
    accueil:{
    
            type: mongoose.Schema.Types.ObjectId,
            ref: 'accueil'
    },
});

var Reservation_intermediaire = module.exports = mongoose.model('Reservation_intermediaire', R_intermediareSchema);
// create Reservation_intermediaire 
module.exports.createReservation_intermediaire = function (newReservation_intermediaire, callback) {
    
    newReservation_intermediaire.save(callback);
}
// get one Reservation_intermediaire by id
module.exports.getReservation_intermediaireById = function (id, callback) {
    Reservation_intermediaire.findById(id, callback);
}

//get all Reservation 
module.exports.getReservationByIntermediaire = function (id, callback) {
    var query = {intermediaire : id, payer_status : 'Oui' };
    Reservation_intermediaire.find(query, callback);
}

// update Reservation_intermediaire 
module.exports.updateReservation_intermediaire = function(id,Reservation_intermediaireUpdate,callback) {
  Reservation_intermediaire.findByIdAndUpdate(id,{$set:Reservation_intermediaireUpdate},callback);
}
// update Reservation_intermediaire  (upload facture) Caissier
module.exports.uploadFacture = function(id,Reservation_intermediaireUpdate,callback) {
    Reservation_intermediaire.findByIdAndUpdate(id,{$set:Reservation_intermediaireUpdate},callback);
  }
// update payer Status Admin and commercial
module.exports.findAndUpdatePayerStatus = function(id,newPayerStatus,callback) {
    Reservation_intermediaire.findByIdAndUpdate(id,{$set:newPayerStatus},callback);
  }
// update prix total caissier
  module.exports.findAndUpdatePrixTotal = function(id, newPrixTotal, callback) {
    Reservation_intermediaire.findByIdAndUpdate(id, {$set:newPrixTotal}, callback);
  }

  // update comition caissier
  module.exports.findAndUpdateComition = function(id, newComition, callback) {
    Reservation_intermediaire.findByIdAndUpdate(id, {$set:newComition}, callback);
  }

  // update status (Accept, refuser, annuller) Admin et commercial 
  module.exports.findAndUpdateStatus = function(id,newStatus,callback) {
    Reservation_intermediaire.findByIdAndUpdate(id, {$set:newStatus},callback);
  }

   // update status present ou non caissier 
   module.exports.findAndUpdateStatusPresent = function(id,newStatusPresent,callback) {
    Reservation_intermediaire.findByIdAndUpdate(id, {$set:newStatusPresent},callback);
  }
// get all Reservation_intermediaire SuperAdmin
module.exports.getAllReservation_intermediaire = function (callback) {
    Reservation_intermediaire.find({payer_status : 'Oui'},callback);
}

// get all Reservation_intermediaire SuperAdmin
module.exports.getAllDemande_intermediaire = function (callback) {
    Reservation_intermediaire.find({status : 'EnAttande'},callback);
}

// get all reservation Intermediaire status Accept (Admin) 
module.exports.getAllIntermediaireAccept = function (callback) {
    Reservation_intermediaire.find({status:"Accept"},callback);
}
