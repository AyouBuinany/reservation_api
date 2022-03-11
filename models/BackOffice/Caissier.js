
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var CaissierSchema = mongoose.Schema({
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    }
});

var Caissier = module.exports = mongoose.model('Caissier', CaissierSchema);

module.exports.createCaissier = function (newCaissier, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newCaissier.password, salt, function (err, hash) {
            newCaissier.password = hash;
            newCaissier.save(callback);
        });
    });
}

module.exports.getCaissierByEmail = function (email, callback) {
    var query = { email: email };
    Caissier.findOne(query, callback);
}

module.exports.getCaissierById = function (id, callback) {
    Caissier.findById(id, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}