
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var accueilSchema = mongoose.Schema({
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    }
});

var Accueil = module.exports = mongoose.model('accueil_auth', accueilSchema);

module.exports.createAccueil = function (newAccueil, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newAccueil.password, salt, function (err, hash) {
            newAccueil.password = hash;
            newAccueil.save(callback);
        });
    });
}

module.exports.getAccueilByEmail = function (email, callback) {
    var query = { email: email };
    Accueil.findOne(query, callback);
}

module.exports.getAccueilById = function (id, callback) {
    Accueil.findById(id, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}