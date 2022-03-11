const express= require('express');
const mongoose = require("./database/config");
const bodyParser= require('body-parser');
const fs = require('fs');
const app= express();
const cors = require('cors');
const loggers = require('./database/loggs');
const morgan = require('morgan');
//router

let RouteAdmin = require('./route/routeAdmin.js');
let RouteSuperAdmin = require('./route/routeSuperAdmin.js'); 
let RouteCommercial= require('./route/routeCommercial.js');
let RouteCaissier= require('./route/routeCaissier.js');
let RouteAgence = require('./route/routeAgence.js');
let RouteRepresentant = require('./route/routeRepresentant.js');
let RouteReservation = require('./route/routeReservation.js');
let RouteIndivideul = require('./route/routeIndivideul.js');
let RouteIntermediaire = require('./route/routeIntermediaire.js');
let routeReservation_Intermediaire = require('./route/routeReservation_Intermediaire.js');
let routeAccueil = require('./route/routeAccueil.js');
let routeAccueilAuth = require('./route/routeAccueil_Auth.js');
let routePartenaire = require('./route/routePartenaire.js');
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTION");
    next();
    });

app.use("/api",RouteAdmin);
app.use('/api',RouteSuperAdmin);
app.use('/api',RouteCommercial);
app.use('/api',RouteCaissier);
app.use('/api',RouteAgence);
app.use('/api',RouteRepresentant);
app.use('/api',RouteReservation);
app.use('/api',RouteIndivideul);
app.use('/api',RouteIntermediaire);
app.use('/api',routeReservation_Intermediaire);
app.use('/api',routeAccueil);
app.use('/api', routeAccueilAuth);
app.use('/api', routePartenaire);

app.use(function(req, res, next) {
    res.status(404).send('Sorry Dont find this route');
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json(err);
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    // loggers.info(`Server listen this Port ${PORT}`);
    // loggers.error("sommting wrong");
    console.info(`Server listen this Port ${PORT}`);
});