const Accueil = require('../models/FrontOffice/Accueil.js');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation.js');
var {ErrorHandler} = require('../midelleware/ErrorHandler.js')
const nodemailer = require("nodemailer");
var fs = require('fs');
var path = require('path')
const multer = require('multer');

let folder= path.join(__dirname,'../../app_accueil/public/caissier');

const storage = multer.diskStorage({
 
    destination: (req, file, cb) => {
       cb(null,  path.join(folder ,'/factures'))
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
  let showImageSingle = upload.single('facture_upload');

// Super Admin Afficher list des reservations

let ListReservation = async function(req, res, next) {
   
    await  Accueil.getReservations( function (err, reservations) {
        if(err) return next(err);
        if (reservations.length < 1) {
            return res.status(404).json({ message: "reservations pas trouvé" })
        }
            res.json({ reservations: reservations })
        });
  
}

let ListReservationsByComition = async function(req, res, next) {
  await Accueil.getReservationsByComition( function (err, reservations) {
    if(err) return next(err);
    if(reservations.length< 1 ){
      return res.status(404).json({ message: "reservations pas trouvé"})
    }
    res.json({ reservations : reservations });
  })
}

let transporter = nodemailer.createTransport({
  //host: "smtp.gmail.com",
  host: "mail.leblokkmarrakech.com", 
  port: 465,
   secure: true, // true for 465, false for other ports
   auth: {
    user:process.env.EMAIL,
    pass:process.env.PASSWORD

},
tls:{
rejectUnauthorized: false
}
});
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate() - 1),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}
// Add reservation Agence
let AddReservation = function (req, res, next) {
    const {  Nom_Complete, telephone,  date, email, menu, Nombre_personne, Boisson, Agence, prix_Total, payer_status, status, present, facture_upload, role, partenaire, remarque, origin} = req.body;
    var newReservation = new Accueil({
      Nom_Complete: Nom_Complete,
      telephone: telephone,
      email: email,
      date: date,
      Nombre_personne:Nombre_personne,
      role:  role,
      partenaire: partenaire,
      remarque : remarque,
      origin:origin
    });
    const formData = formatDate(new Date(date));
       Accueil.createReservation(newReservation,async function (err, reservation) {
       if (err) return next(err);
       //
       

// send mail with defined transport object
 let info = await transporter.sendMail({
 // "ayoub.elbouinany99@gmail.com"
  from: process.env.EMAIL, // sender address
  to: email, // list of receivers
  subject: "demande de réservation ✔", // Subject line
  html:
   `
   <h1> Leblokk </h1>
   <h3>Merci ${Nom_Complete} </h3>,

  <p> Votre demande de réservation est en attente de confirmation </p>
   
  <p> Donnez-nous quelques instants pour nous assurer que nous avons de la place pour vous. Vous recevrez bientôt un autre courriel de notre part. Si cette demande a été faite en dehors de nos heures normales de travail, il se peut que nous ne puissions pas la confirmer avant que nous soyons à nouveau ouverts.</p>
   
  <p> Les détails de votre reservation: </p>
   ${Nom_Complete} <br>
   ${Nombre_personne} personnes <br>
   ${formData}<br>
   `,
  //         // html body", // html body
});
        //send 
        res.json({ message: 'reservation créé' })
            });

      

}

// Afficher les reservation Non Payer in agence
let getReservationById = async function (req, res, next) {
const {id} = req.params;
    await  Accueil.getReservationById(id, function (err, reservation) {
       if (err) return next(err);
       
        if (!reservation) {
            return res.status(404).json({ message: "reservation pas trouvé" })
        }
            res.json({ reservation: reservation })
            });

}


 /////////////////////////Updates//////////////////////////


  
 
  const url = 'http://localhost:3004';
// update reservation Caissier 
let updateReservationComition = async function (req, res, next) {
            console.log(req.file.filename);
             let reservationUpdate = {
                facture_upload:  req.file.filename,
                prix_Total: req.body.prix_Total
             };
                await Accueil.reservationComitionUpdate(req.body.id, reservationUpdate,function (err, reservation){
                 if (err) return next(err);
                     //send 
                     res.json({ message: 'reservation Modifier' })
                         }).then(err => {
                           console.log({err});
                         })
}
 

let UpdateReservation = async function(req, res, next) {
 let message = "";
  let title ="";
 if(req.body.status == undefined){
   req.body.status="Accepte"
 }
 const formData = formatDate(new Date(req.body.date));

    await  Accueil.updateReservation(req.body.id,req.body,async function (err, reservation) {
        if (err) return next(err); 
          // create reusable transporter object using the default SMTP transport
        if(req.body.status==="Accepte") {
            title = `Votre réservation au BLOKK est Confirmer`;
            message = ` <h3>Bonjour ${req.body.Nom_Complete} </h3> <br>
            
            ,

              <p>Votre demande de réservation a été confirmée. Nous nous réjouissons de vous accueillir prochainement. </p>
              <p>Votre réservation:<br>
              <b>${req.body.Nom_Complete}</b>
              <b>${req.body.Nombre_personne}</b> personnes
              <b>${formData}</b>
              </p>
            `;
        } else if(req.body.status==="Annuler"){
          title = `Votre réservation au BLOKK est en Annulée`;
            message = `<h3>Hi ${req.body.Nom_Complete} </h3> <br>,
              <p>Votre réservation avec les détails suivants a été annulée :/p>
              <p>Votre réservation: <br>
              <b>${req.body.Nom_Complete} </b> <br>
              <b>${req.body.Nombre_personne} </b> personnes <br>
              <b>${formData} </b><br>
              </p>
            `;
        }
// send mail with defined transport object
let info = await transporter.sendMail({

    from: process.env.EMAIL, // sender address
    to: req.body.email, // list of receivers
    subject: title, // Subject line
    html:
          `
          <body>
          <table align="center" border="0" cellpadding="0" cellspacing="0"
              width="550" bgcolor="white">
            <tbody>
                <tr>
                    <td align="center">
                        <table align="center" border="0" cellpadding="0"
                              cellspacing="0" class="col-550" width="550">
                        </table>
                    </td>
                </tr>
                <tr style="height: 300px;">
                    <td align="center" style="border: none;
                              padding-right: 10px;padding-left:10px">

                        <p style="font-weight: bolder;font-size: 15px;
                                  letter-spacing: 0.025em;
                                  color:black;">
                                  ${message}
                        </p>
                    </td>
                </tr>
            </tbody>
          </table>
          </body>

`,
})    
             res.json({ message: 'reservation modified' })
             });
  }



// Caissier update prix total de reservation

// let UpdatePrixTotalReservationByCaissier = async function(req, res, next) {
//     const {Agence, date, status, prix_Total, present} = req.body;
//     let {id} = req.params;
//     let updatePrixTotal= {
//         prix_Total: prix_Total
//     };
//         await  Accueil.findAndUpdatePrixTotal(id, updatePrixTotal, function (err, reservations) {
//             if (err) return next(err);
//               res.json({ message: 'reservation prix total modified' })
//             });
// }



let GetCountReservationByAgence = async function(req, res, next) {
    const {id} = req.params;

    await Accueil.getNombreReservations(id, function(err, nombre) {
        if(err) return next(err);
        res.json({nombre_reservation: nombre});
    });
}


// partenaire
let ListReservationsByPartenaire = async function(req, res, next) {
  let {id} = req.params;
  await Accueil.getReservationsByPartenaire(id, function (err, reservations) {
    if (err) return next(err);
    if(!reservations ){
      return res.status(404).json({ message: "reservations pas trouvé"})
    }
    res.json({ reservations : reservations });
  })
}

  module.exports = {
      AddReservation, UpdateReservation, ListReservation,  showImageSingle, updateReservationComition,   GetCountReservationByAgence, getReservationById, ListReservationsByComition, ListReservationsByPartenaire
  }
