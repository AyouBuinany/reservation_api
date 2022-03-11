
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var RepresentantSchema = mongoose.Schema({
    Agence_Id : {
        type: String,
    },
    Nom_Representant: {
        type : String,
        require:true
    },
    userName: {
        type : String,
        require: true
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String,
        require: true
    },
    telephone: {
        type : String,
        require:true
    },
    id_Commercial: {
        type: String,
        default:0
    },
    id_Admin: {
        type: String,
        default:0
    }
});

var Representant = module.exports = mongoose.model('Representant', RepresentantSchema);

module.exports.createRepresentant = function (newRepresentant, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newRepresentant.password, salt, function (err, hash) {
            newRepresentant.password = hash;
            newRepresentant.save(callback);
        });
    });
}

module.exports.getRepresentantByEmail = function (email, callback) {
    var query = { email: email };
    Representant.findOne(query, callback);
}

module.exports.getRepresentantById = function (id, callback) {
    Representant.findById(id, callback);
}
//get all representant by commercial 
module.exports.getRepresentantByCommercial = function (id, callback) {
    var query = {id_Commercial : id};
    Representant.find(query, callback);
}
//get all representant by Admin
module.exports.getRepresentantByAdmin = function (id, callback) {
    var query = {id_Admin : id};
    Representant.find(query, callback);
}
//get all representant by Agence
module.exports.getRepresentantByAgence = function (id, callback) {
    var query = {Agence_Id : id};
    Representant.find(query, callback);
}

module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}