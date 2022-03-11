const Caissier = require('../models/BackOffice/Caissier.js');
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

    Caissier.getCaissierByEmail(email, function (err, caissier) {
      if (err) return next(err)
      if (!caissier) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Caissier.comparePassword(password, caissier.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { caissier: caissier },
            process.env.TOKEN_SUCRET_CAISSIER,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
                caissier_id: caissier.id,
                token: token,
                expire_in: '7d'
            },
            role:'caissier'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }

   // Register
let RegisterCaissier = function (req, res, next) {
    const { email, password} = req.body;
 
    var newCaissier= new Caissier({
        email: email,
        password: password,
    });
    Caissier.getCaissierByEmail(email, function (error, caissier) {
      if (error) return next(err)
      if (caissier) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "caissier is existed"
        })
        
        return next(err)
      }
       Caissier.createCaissier(newCaissier, function (err, caissier) {
        if (err) return next(err);
            res.json({ message: 'caissier created' })
       });
    })
  }


  module.exports = {
    Login, RegisterCaissier
  }