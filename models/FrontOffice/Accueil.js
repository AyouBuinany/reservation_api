
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var AccueilSchema = mongoose.Schema({
    
    Nom_Complete: {
        type : String,
        require:true
    },
    telephone:{
        type: String,
        require:true
    },
    email:{
        type:String,
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
  role: {
      type:String,
      default:'individueil'
  },
  table : {
      type: String,
      default: ""
  },
  remarque:{
      type : String,
      default:""
  },
  partenaire: {
      type:String,
      default:0
  },
  agence: {
    type:String,
    default:0
  },
  origin:{
      type: String,
  },
  status: {
    type: String,
    default: "EnAttande",
    enum: ['EnAttande', 'Accepte', 'Annuler']
}
},
  { timestamps: { createdAt: 'created_at' } }
);

var Accueil = module.exports = mongoose.model('Accueil', AccueilSchema);
// create reservation (Agence, individuel)
module.exports.createReservation = function (newReservation, callback) {
    
    newReservation.save(callback);
}
// get one reservation by id
module.exports.getReservationById = function (id, callback) {
    Accueil.findById(id, callback);
}

//  // update comition caissier
//  module.exports.findAndUpdateComition = function(id, newComition, callback) {
//     Reservation.findByIdAndUpdate(id, {$set:newComition}, callback);
//   }
//get all Reservation 
module.exports.getReservations = function (callback) {

    Accueil.find(callback);
}
module.exports.removeReservation = function (id, callback) {

    Accueil.findByIdAndRemove(id, callback);
}

//get all Reservation By Comition 
module.exports.getReservationsByComition = function (callback) {
let query = {comition: 10 };
    Accueil.find(query, callback);
}
//get all Reservation By Partenaire 
module.exports.getReservationsByPartenaire = function (id, callback) {
    let query  = {partenaire : id};
        Accueil.find(query, callback);
    }
// update Reservation 
module.exports.updateReservation = function(id,ReservationUpdate,callback) {
  Accueil.findByIdAndUpdate(id,{$set:ReservationUpdate},callback);
}
// update Reservation  (upload facture) Caissier
module.exports.reservationComitionUpdate = function(id,reservationUpdate,callback) {
    Accueil.findByIdAndUpdate(id,{$set:reservationUpdate},callback);
  }
// update prix total caissier
  module.exports.findAndUpdatePrixTotal = function(id, newPrixTotal, callback) {
    Accueil.findByIdAndUpdate(id, {$set:newPrixTotal}, callback);
  }

//    // update status present ou non caissier 
module.exports.findAndUpdateStatus = function(id,newStatus,callback) {
    Accueil.findByIdAndUpdate(id, {$set:newStatus},callback);
  }
// Nombre reservation de agence 
module.exports.getNombreReservations = function (callback) {
    Accueil.count(callback);
}




