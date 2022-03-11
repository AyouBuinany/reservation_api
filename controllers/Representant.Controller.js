const Representant = require('../models/FrontOffice/Representant.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
const nodemailer = require("nodemailer");



// Register
let RegisterRepresentant = function (req, res, next) {
    const { Agence_Id, Nom_Representant, userName, email, password, telephone , id_Commercial, id_Admin} = req.body;
    const chars = userName.split(' ');
    const U1 = chars[0].split('');
    const U2 =chars[1].split(''); 
    const specailName = (U1[0] + U2[0]).toUpperCase();
  
  if(id_Admin != 0 || id_Commercial != 0){
    var newRepresentant = new Representant({
        Agence_Id: Agence_Id,
        Nom_Representant: Nom_Representant,
        userName: specailName + '_' + userName,
        telephone:telephone,
        email: email,
        password:specailName +'_'+password,
        id_Admin: id_Admin,
        id_Commercial: id_Commercial
    });
    Representant.getRepresentantByEmail(email, function (error, representant) {
      if (error) return next(err)
      if (representant) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "representant is existed"
        })
        
        return next(err)
      }
       Representant.createRepresentant(newRepresentant,async function (err, representant) {
        if (err) return next(err);
        //send Email

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'ayoub.elbouinany99@gmail.com',
        pass: 'Ayoub123@', // generated ethereal user
    },
    tls:{
        rejectUnauthorized: false
    }
});
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'ayoub.elbouinany99@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Register with new password ✔", // Subject line
    html:
     `<div> 
     Merci monsieur representant <b> ${Nom_Representant} </b> 
     <br> le mote pass est : <b>${specailName + '_' + password}</b>
     </div>`,
    //         // html body", // html body
  });

  
 
            res.json({ message: 'representant created' })
           
            
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

    Representant.getRepresentantByEmail(email, function (err, representant) {
      if (err) return next(err)
      if (!representant) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Representant.comparePassword(password, representant.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { representant: representant },
            process.env.TOKEN_SUCRET_REPRESENTANT,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
              representant_id: representant.id,
              token: token,
              expire_in: '7d'
            },
            role:'individuel'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }
// get list Representant by commercial And Admin
  const getRepresentantByCommercial = async (req, res,next) => {
    let {id} = req.params;

        await Representant.getRepresentantByCommercial(id, function (e, representants) {
            if (e) {
              e.status = 406; return next(e);
            }
            if (representants.length < 1) {
              return res.status(404).json({ message: "representants not found" })
            }
            res.json({ representants: representants })
        }) 

  };
  const getRepresentantByAdmin = async(req, res, next) => {
    let {id}= req.params;
    await Representant.getRepresentantByAdmin(id, function (e, representants) {
      if (e) {
        e.status = 406; return next(e);
      }
    if (representants.length < 1) {
      return res.status(404).json({ message: "representants not found" })
    }
      res.json({ representants: representants })
    })
  }


  // get list Representant by Agence
  const getRepresentantByAgence = async (req, res,next) => {
    let {id} = req.params;
         await Representant.getRepresentantByAgence(id, function (e, representants) {
             if (e) {
               e.status = 406; return next(e);
             }
             if (representants.length < 1) {
               return res.status(404).json({ message: "representants not found" })
             }
             res.json({ representants: representants })
         }) 
      }

  module.exports = {
      RegisterRepresentant, Login, getRepresentantByCommercial, getRepresentantByAgence, getRepresentantByAdmin
  }