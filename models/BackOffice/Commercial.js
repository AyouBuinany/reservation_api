
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var CommercialSchema = mongoose.Schema({
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    userName: {
        type : String ,
        require : true
    }
});

var Commercial = module.exports = mongoose.model('Commercial', CommercialSchema);

module.exports.createCommercial = function (newCommercial, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newCommercial.password, salt, function (err, hash) {
            newCommercial.password = hash;
            newCommercial.save(callback);
        });
    });
}

module.exports.getCommercialByEmail = function (email, callback) {
    var query = { email: email };
    Commercial.findOne(query, callback);
}

module.exports.getCommercialById = function (id, callback) {
    Commercial.findById(id, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}