
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var partenaireSchema = mongoose.Schema({
    name : {
        type: String,
        require:true
    },
    
    phone : {
        type: String,
        require:true
    },
    email: {
        type:String,
        require:true
    },
    password: {
        type: String,
        require:true
    },
    logo : {
        type: String
    },
    
},
{ timestamps: { createdAt: 'created_at' } }
);

var Partenaire = module.exports = mongoose.model('partenaire', partenaireSchema);

module.exports.createPartenaire = function (newPartenaire, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newPartenaire.password, salt, function (err, hash) {
            newPartenaire.password = hash;
            newPartenaire.save(callback);
        });
    });
}

module.exports.getPartenaireByEmail = function (email, callback) {
    var query = { email: email };
    Partenaire.findOne(query, callback);
}

module.exports.getPartenaireById = function (id, callback) {
    Partenaire.findById(id, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}