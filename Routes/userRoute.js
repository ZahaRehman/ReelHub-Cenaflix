const express= require('express')
const router= express.Router();
const authController= require('./../Controller/authController')
const userController= require('./../Controller/userController')

router.route('/updateMe').patch(authController.protected,userController.updateMe);

router.route('/deleteMe').delete(authController.protected,userController.deleteMe);
router.route('/getAllUsers').get(userController.getAllUsers);

module.exports= router;
 

