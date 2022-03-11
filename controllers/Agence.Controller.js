const Agence = require('../models/FrontOffice/Agence.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
const nodemailer = require("nodemailer");


// Register
let RegisterAgence = function (req, res, next) {
  
    const { Nom_Agence, adress, telephone, email, password, id_Admin , id_Commercial} = req.body
 
  if(id_Admin !== 0 || id_Commercial !== 0){
    var newAgence = new Agence({
        Nom_Agence: Nom_Agence,
        adress:adress,
        telephone:telephone,
        email: email,
        password: password,
        id_Admin: id_Admin,
        id_Commercial: id_Commercial
    });
    Agence.getAgenceByEmail(email, function (error, agence) {
      if (error) return next(error)
      if (agence) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "agence is existed"
        })
        
        return next(err)
      }
       Agence.createAgence(newAgence,async function (err, agence) {
        if (err) return next(err);
        //send Email

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        // user: 'ayoub.elbouinany99@gmail.com',
        // pass: 'Ayoub123@', // generated ethereal user
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
     
      },
    tls:{
        rejectUnauthorized: false
    }
});
  // send mail with defined transport object
  let info = await transporter.sendMail({
   // "ayoub.elbouinany99@gmail.com"
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: "Register with new password ✔", // Subject line
    html:
     `<div> 
     thank you Agance <b> ${Nom_Agence} </b> 
     <br> your new password : <b>${password}</b>
     </div>`,
    //         // html body", // html body
  });

  
 
            res.json({ message: 'agence created' })
           
            
       });
})
}
}



  //Login 
  let Login = function (req, res, next) {
    const { email, password } = req.body;
    
    const { error } = validation.loginValidation(req.body.credential);
    if(error){
      let err = ErrorHandler('login error', 400, 'missing_field', { message: error.details[0].message })
      return next(err)
    }

    Agence.getAgenceByEmail(email, function (err, agence) {
      if (err) return next(err)
      if (!agence) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Agence.comparePassword(password, agence.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { agence: agence },
            process.env.TOKEN_SUCRET_AGENCE,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
              agence_id: agence.id,
              token: token,
              expire_in: '7d'
            },
            role:'agence'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }
// get Agence By admin 
let ListAgenceByAdmin =async function (req, res, next) {
  const {id} = req.params;
  await  Agence.getAgencesByAdmin(id, function (err, agences) {
     if (err) return next(err);
     
      if (agences.length < 1) {
          return res.status(404).json({ message: "agence introuvable" })
      }
          res.json({ agences: agences })
          });
}
 
// get Agence By Commercial 
let ListAgenceByCommercial =async function (req, res, next) {
  const {id} = req.params;
  await  Agence.getAgencesByCommercial(id, function (err, agences) {
     if (err) return next(err);
     
      if (agences.length < 1) {
          return res.status(404).json({ message: "agence introuvable" })
      }
          res.json({ agences: agences })
          });
}

// get Agence By Commercial 
let AgenceById =async function (req, res, next) {
  const {id} = req.params;
  await  Agence.getAgenceById(id, function (err, agence) {
     if (err) return next(err);
     
      if (agence.length < 1) {
          return res.status(404).json({ message: "agence introuvable" })
      }
          res.json({ agence: agence })
          });
}

module.exports = {
      RegisterAgence,Login, ListAgenceByAdmin, ListAgenceByCommercial, AgenceById
  }