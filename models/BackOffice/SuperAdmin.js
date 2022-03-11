
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var SuperAdminSchema = mongoose.Schema({
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    }
});

var SuperAdmin = module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);

module.exports.createSuperAdmin = function (newSuperAdmin, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newSuperAdmin.password, salt, function (err, hash) {
            newSuperAdmin.password = hash;
            newSuperAdmin.save(callback);
        });
    });
}

module.exports.getSuperAdminByEmail = function (email, callback) {
    var query = { email: email };
    SuperAdmin.findOne(query, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}
