
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var intermediaireSchema = mongoose.Schema({
    Nom_complete: {
        type : String,
        require:true
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
    date:{
        type:Date,
        default:Date.now
    }
});

var Intermediaire = module.exports = mongoose.model('intermediaire', intermediaireSchema);


module.exports.createIntermediaire = function (newintermediaire, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newintermediaire.password, salt, function (err, hash) {
            newintermediaire.password = hash;
            newintermediaire.save(callback);
        });
    });
    // newAgence.password =  bcrypt.hashSync(newAgence.password, 10);
    // newAgence.save();
}

module.exports.getintermediaireByEmail = function (email, callback) {
    var query = { email: email };
    Intermediaire.findOne(query, callback);
}

module.exports.getintermediaireById = function (id, callback) {
    Intermediaire.findById(id, callback);
}


module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getIntermediaireById = function (id, callback) {
    Intermediaire.findById(id, callback);
}

