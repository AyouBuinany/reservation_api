const express= require('express');
const Admin= require('../controllers/Admin.Controller.js');
const route = express.Router();
route.post("/admin/register",Admin.RegisterAdmin);
route.post("/admin/login",Admin.Login);
route.get("/admin/listReservationAgence/:id", Admin.Admin_ListReservationsAgences);
module.exports=route;