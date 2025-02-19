const express = require('express')
const authController= require('./../Controller/authController');
const adminController= require('./../Controller/adminController')
const { route } = require('./moviesRoutes');

const router= express.Router();

router.route('/create-admin')
        .post(
            authController.protected,            
            adminController.restrictTo('admin'),
            adminController.createAdmin           
        );

module.exports= router;
