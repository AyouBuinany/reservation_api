const Admin = require('../models/BackOffice/Admin.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
const Agence = require('../models/FrontOffice/Agence.js');
  //Login 
  let Login = function (req, res, next) {
    const { email, password } = req.body
    
    const { error } = validation.loginValidation(req.body.credential);
    if(error){
      let err = ErrorHandler('login error', 400, 'missing_field', { message: error.details[0].message })
      return next(err)
    }

    Admin.getAdminByEmail(email, function (err, admin) {
      if (err) return next(err)
      if (!admin) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Admin.comparePassword(password, admin.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { admin: admin },
            process.env.TOKEN_SUCRET_ADMIN,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
             admin_id: admin.id,
              token: token,
              expire_in: '7d'
            },
            role:'admin'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }

  // Register
let RegisterAdmin = function (req, res, next) {
    const { email, password} = req.body
 
    var newAdmin= new Admin({
        email: email,
        password: password,
    });
    Admin.getAdminByEmail(email, function (error, admin) {
      if (error) return next(err)
      if (admin) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "admin is existed"
        })
        
        return next(err)
      }
       Admin.createAdmin(newAdmin, function (err, admin) {
        if (err) return next(err);
            res.json({ message: 'admin created' })
       });
    })
  }
// List Reservations Agences 
  let Admin_ListReservationsAgences = async function(req, res, next) {
   let { id } = req.params;
    await  Admin.Admin_getAllReservationsAgences(id, function (err, reservations_agences) {
      if(err) return next(err);
        if (reservations_agences.length < 1) {
            return res.status(404).json({ message: "liste reservations pas trouvé" })
        }
            res.json({ reservations_agences: reservations_agences })
        });
  
}

  module.exports = {
    Login, RegisterAdmin, Admin_ListReservationsAgences
  }