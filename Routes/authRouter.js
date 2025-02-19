const express = require('express')
const authController= require('./../Controller/authController');
const { route } = require('./moviesRoutes');

const router= express.Router();

router.route('/signup')
            .post(authController.signup);

router.route('/login')
            .post(authController.login);
router.route('/forgotpassword').post(authController.forgotPassword)
router.route('/resetpassword/:token').patch(authController.resetpassword)
router.route('/updatepassword').patch(authController.protected,authController.updatePassword)



module.exports= router;
