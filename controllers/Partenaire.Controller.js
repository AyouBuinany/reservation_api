const Partenaire = require('../models/FrontOffice/Partenaire.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')

var fs = require('fs');
var path = require('path')
const multer = require('multer');

let folder= path.join(__dirname,'../../app_accueil/');

const storage = multer.diskStorage({
 
    destination: (req, file, cb) => {
       cb(null,  path.join(folder ,'/public'))
        },
    filename: (req, file, cb) => {
        
                //cb(null,new Date().toISOString() + file.originalname);
                cb(null, new Date().toISOString().replace(/:/g,'-')+ file.originalname)
            }
  
  });
  const fileFilter=(req, file, cb)=>{
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png"  || file.mimetype === "application/pdf") {
        cb(null, true)
    } else {
        cb({message:'STP rentrez une image!'}, false)
    }
}

var upload = multer();
  var upload = multer({
    storage: storage,
     limits: {
        fieldSize: 1024 * 1024 * 5
     },
   // fileFilter: fileFilter
    
});
//Upload Single Image
  let showImageSingle = upload.single('logo');

  //Login 

  let Login = function (req, res, next) {
    const { email, password } = req.body
    
    const { error } = validation.loginValidation(req.body.credential);
    if(error){
      let err = ErrorHandler('login error', 400, 'missing_field', { message: error.details[0].message })
      return next(err)
    }

    Partenaire.getPartenaireByEmail(email, function (err, partenaire) {
      if (err) return next(err)
      if (!partenaire) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Partenaire.comparePassword(password, partenaire.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { partenaire: partenaire },
            process.env.TOKEN_SUCRET_PARTENAIRE,
            { expiresIn: '7d' }
          )
          res.status(201).json({
            user_token: {
              partenaire_id: partenaire.id,
              token: token,
              expire_in: '7d'
            },
            role:'partenaire'
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }

  // Register
let RegisterPartenaire = function (req, res, next) {
    const { name, tele, email, password} = req.body
 
    var newPartenaire= new Partenaire({
        name:name,
        tele:tele,
        logo:req.file.filename,
        email: email,
        password: password,
    });
    Partenaire.getPartenaireByEmail(email, function (error, partenaire) {
      if (error) return next(err)
      if (partenaire) {
        let err = new ErrorHandler('signin error', 409, 'invalid_field', {
          message: "partenaire is existed"
        })
        
        return next(err)
      }
       Partenaire.createPartenaire(newPartenaire, function (err, partenaire) {
        if (err) return next(err);
            res.json({ message: 'partenaire created' })
       });
    })
  }


  // Afficher les partenaire Non Payer in agence
let getPartenaireById = async function (req, res, next) {
  const {id} = req.params;
      await  Partenaire.getPartenaireById(id, function (err, partenaire) {
         if (err) return next(err);
         
          if (!partenaire) {
              return res.status(404).json({ message: "partenaire pas trouvé" })
          }
              res.json({ partenaire: partenaire })
              });
  
  }

  module.exports = {
    Login, RegisterPartenaire, getPartenaireById, showImageSingle
  }