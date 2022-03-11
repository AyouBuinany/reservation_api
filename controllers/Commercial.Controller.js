const Commercial = require('../models/BackOffice/Commercial.js');
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

    Commercial.getCommercialByEmail(email, function (err, commercial) {
      if (err) return next(err)
      if (!commercial) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Commercial.comparePassword(password, commercial.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { commercial: commercial },
            process.env.TOKEN_SUCRET_COMMERCIAL,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
             commercial_id: commercial.id,
              token: token,
              expire_in: '7d'
            },
            role:'commercial'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }

  // Register
let RegisterCommercial = function (req, res, next) {
    const { email, password} = req.body;
 
    var newCommercial= new Commercial({
        email: email,
        password: password,
    });
    Commercial.getCommercialByEmail(email, function (error, commercial) {
      if (error) return next(err)
      if (commercial) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "commercial is existed"
        })
        
        return next(err)
      }
       Commercial.createCommercial(newCommercial, function (err, commercial) {
        if (err) return next(err);
            res.json({ message: 'commercial created' })
       });
    })
  }


  module.exports = {
    Login, RegisterCommercial
  }