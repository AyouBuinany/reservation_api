
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var AgenceSchema = mongoose.Schema({
    Nom_Agence: {
        type : String,
        require:true
    },
    adress: {
        type : String,
        require: true
    },
    telephone: {
        type : String,
        require:true
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String,
        require: true
    },
    id_Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    id_Commercial: {
        type: String,
        default:0
    },
    date:{
        type:Date,
        default:Date.now
    }
});

var Agence = module.exports = mongoose.model('Agence', AgenceSchema);

module.exports.createAgence = function (newAgence, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newAgence.password, salt, function (err, hash) {
            newAgence.password = hash;
            newAgence.save(callback);
        });
    });
    // newAgence.password =  bcrypt.hashSync(newAgence.password, 10);
    // newAgence.save();
}

module.exports.getAgenceByEmail = function (email, callback) {
    var query = { email: email };
    Agence.findOne(query, callback);
}

module.exports.getAgenceById = function (id, callback) {
    Agence.findById(id, callback);
}
module.exports.getAgencesByAdmin = function (id, callback) {
    var query = {id_Admin : id};
    Agence.find(query, callback);
}
module.exports.getAgencesByCommercial = function (id, callback) {
    var query = {id_Commercial : id};
    Agence.find(query, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}


