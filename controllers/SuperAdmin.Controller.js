const SuperAdmin = require('../models/BackOffice/SuperAdmin.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')

  //Login 
  let Login = function (req, res, next) {
    const { email, password } = req.body;
    
    const { error } = validation.loginValidation(req.body.credential);
    if(error){
      let err = ErrorHandler('login error', 400, 'missing_field', { message: error.details[0].message })
      return next(err)
    }

    SuperAdmin.getSuperAdminByEmail(email, function (err, superadmin) {
      if (err) return next(err)
      if (!superadmin) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      SuperAdmin.comparePassword(password, superadmin.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { superadmin: superadmin },
            process.env.TOKEN_SUCRET_SUPERADMIN,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            superadmin_token: {
             user_id: superadmin.id,
              token: token,
              expire_in: '7d'
            },
            role:'superAdmin'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }
   // Register
let RegisterSuperAdmin = function (req, res, next) {
    const { email, password} = req.body
 
    var newSuperAdmin= new SuperAdmin({
        email: email,
        password: password,
    });
    SuperAdmin.getSuperAdminByEmail(email, function (error, superadmin) {
      if (error) return next(err)
      if (superadmin) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "superadmin is existed"
        })
        
        return next(err)
      }
       SuperAdmin.createSuperAdmin(newSuperAdmin, function (err, superadmin) {
        if (err) return next(err);
            res.json({ message: 'superadmin created' })
       });
    })
  }


  module.exports = {
    Login, RegisterSuperAdmin
  }