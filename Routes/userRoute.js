const express= require('express')
const router= express.Router();
const authController= require('./../Controller/authController')
const userController= require('./../Controller/userController')

router.route('/updateMe').patch(authController.protected,userController.updateMe);

router.route('/deleteMe').delete(authController.protected,userController.deleteMe);
router.route('/getAllUsers').get(userController.getAllUsers);



//test 

router.post('/watchlist', authController.protected, userController.addToWatchlist);
router.delete('/watchlist/:movieId', authController.protected, userController.removeFromWatchlist);



module.exports= router;
 

