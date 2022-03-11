const Accueil = require('../models/BackOffice/Accueil.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
  //Login 
  let Login = function (req, res, next) {
    const { email, password } = req.body
    
    const { error } = validation.loginValidation(req.body.credential);
    if(error){
      let err = ErrorHandler('login error', 400, 'missing_field', { message: error.details[0].message })
      return next(err)
    }

    Accueil.getAccueilByEmail(email, function (err, accueil) {
      if (err) return next(err)
      if (!accueil) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Accueil.comparePassword(password, accueil.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { accueil: accueil },
            process.env.TOKEN_SUCRET_ACCUEIL,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
             accueil_id: accueil.id,
              token: token,
              expire_in: '7d'
            },
            role:'accueil'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }

  // Register
let RegisterAccueil = function (req, res, next) {
    const { email, password} = req.body
 
    var newAccueil= new Accueil({
        email: email,
        password: password,
    });
    Accueil.getAccueilByEmail(email, function (error, accueil) {
      if (error) return next(err)
      if (accueil) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "accueil is existed"
        })
        
        return next(err)
      }
       Accueil.createAccueil(newAccueil, function (err, accueil) {
        if (err) return next(err);
            res.json({ message: 'accueil created' })
       });
    })
  }


  module.exports = {
    Login, RegisterAccueil,
  }