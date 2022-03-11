
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var IndividuelSchema = mongoose.Schema({
    Nom_complete: {
        type: String,
        index: true
    },
    email: {
        type: String,
        index: true
    },
    telephone:{
        type: String,
        require:true
    },
    date_reservation:{
        type:Date,
        default:Date.now
    },
    heure:{
        type: String,
        require:true
    },
    Nombre_personne:{
        type: Number,
        require:true

    },
    message: {
        type: String
    },
    status: {
        type: String,
        default: "EnAttande",
        enum: ['EnAttande', 'Accept', 'Refuser', 'Annuler']
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
    present: {
        type : String,
        default:'Non',
        enum: ['Oui','Non']
    },
    facture_upload:{
        type: String
    },
    comition:{
        type:Number,
        default:0
    },
    accueil:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'accueil'
        
    }
});

var Individuel = module.exports = mongoose.model('Individuel', IndividuelSchema);

module.exports.createIndividuel = function (newIndividuel, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newIndividuel.password, salt, function (err, hash) {
            newIndividuel.password = hash;
            newIndividuel.save(callback);
        });
    });
}

module.exports.getIndividuelByEmail = function (email, callback) {
    var query = { email: email };
    Individuel.findOne(query, callback);
}

module.exports.getIndividuelById = function (id, callback) {
    Individuel.findById(id, callback);
}
// get all reservation individuel SuperAdmin 
module.exports.getAllIndividuels = function (callback) {
    Individuel.find({payer_status:'Oui'},callback);
}

// get all reservation individuel status Accept (caissier) 
module.exports.getAllIndividuelAccept = function (callback) {
    Individuel.find({status:"Accept"},callback);
}


// get all demande de reservation individuel  
module.exports.getAllDemandeIndividuels = function (callback) {
    Individuel.find({status:'EnAttande'},callback);
}

// update Status Admin ['Accept', 'Refuser', 'Annuler'] 
module.exports.findAndUpdateStatus = function(id,newStatus,callback) {
    Individuel.findByIdAndUpdate(id,{$set:newStatus},callback);
  }

 // update status present ou non caissier 
 module.exports.findAndUpdateStatusPresent = function(id,newStatusPresent,callback) {
    Individuel.findByIdAndUpdate(id, {$set:newStatusPresent},callback);
  }
   // update comition caissier
   module.exports.findAndUpdateComition = function(id, newComition, callback) {
    Individuel.findByIdAndUpdate(id, {$set:newComition}, callback);
  }


// update payer Status Admin 
module.exports.findAndUpdatePayerStatus = function(id,newPayerStatus,callback) {
    Individuel.findByIdAndUpdate(id,{$set:newPayerStatus},callback);
  }
// update prix total caissier
  module.exports.findAndUpdatePrixTotal = function(id, newPrixTotal, callback) {
    Individuel.findByIdAndUpdate(id, {$set:newPrixTotal}, callback);
  }

// update Reservation  (upload facture) Caissier
module.exports.uploadFacture = function(id,reservationUpdate,callback) {
    Individuel.findByIdAndUpdate(id,{$set:reservationUpdate},callback);
  }