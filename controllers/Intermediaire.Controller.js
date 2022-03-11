const Intermediaire = require('../models/FrontOffice/intermediaire.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
const nodemailer = require("nodemailer");


// Register
let Registerintermediaire = function (req, res, next) {
  
    const { Nom_complete, telephone, email, password } = req.body
    var newintermediaire = new Intermediaire({
        Nom_complete: Nom_complete,
        telephone:telephone,
        email: email,
        password: password
    });
    Intermediaire.getintermediaireByEmail(email, function (error, intermediaire) {
      if (error) return next(error)
      if (intermediaire) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "intermediaire existe"
        })
        
        return next(err)
      }
      Intermediaire.createIntermediaire(newintermediaire,async function (err, intermediaire) {
        if (err) return next(err);
        //send Email

// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//         // user: 'ayoub.elbouinany99@gmail.com',
//         // pass: 'Ayoub123@', // generated ethereal user
//         user:process.env.EMAIL,
//         pass:process.env.PASSWORD
     
//       },
//     tls:{
//         rejectUnauthorized: false
//     }
// });
  // send mail with defined transport object
  // let info = await transporter.sendMail({
  //  // "ayoub.elbouinany99@gmail.com"
  //   from: process.env.EMAIL, // sender address
  //   to: email, // list of receivers
  //   subject: "Register with new password ✔", // Subject line
  //   html:
  //    `<div> 
  //    thank you  <b> ${Nom_Complete} </b> 
  //    <br> your new password : <b>${password}</b>
  //    </div>`,
  //   //         // html body", // html body
  // });

  
 
            res.json({ message: 'intermédiare créé' })
           
            
       });
})
}



  //Login 
  let Login = function (req, res, next) {
    const { email, password } = req.body;
    
    const { error } = validation.loginValidation(req.body.credential);
    if(error){
      let err = ErrorHandler('login error', 400, 'missing_field', { message: error.details[0].message })
      return next(err)
    }

    Intermediaire.getintermediaireByEmail(email, function (err, intermediaire) {
      if (err) return next(err)
      if (!intermediaire) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "email ou mot de passe incorrect" })
        return next(err)
      }
      Intermediaire.comparePassword(password, intermediaire.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { intermediaire: intermediaire },
            process.env.TOKEN_SUCRET_INTERMEDIAIRE,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
              intermediaire_id: intermediaire.id,
              token: token,
              expire_in: '7d'
            },
            role:'intermediaire'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "email ou mot de passe incorrect" })
          return next(err)
        }
      })
    })
  }

 

// get Intermediaire By id 
let IntermediaireById =async function (req, res, next) {
  const {id} = req.params;
  await  Intermediaire.getIntermediaireById(id, function (err, intermediaire) {
     if (err) return next(err);
     
      if (intermediaire.length < 1) {
          return res.status(404).json({ message: "Intermediaire introuvable" })
      }
          res.json({ intermediaire: intermediaire })
          });
}
module.exports = {
      Registerintermediaire,Login, IntermediaireById
  }