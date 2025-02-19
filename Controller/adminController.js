const User= require('./../Models/userModal');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt= require('jsonwebtoken')
const customError= require('./../Utils/customError');
const { promisify } = require('util');
const sendEmail= require('./../Utils/email')
const crypto= require('crypto')
const authController= require('./authController')




exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new customError('You do not have permission to perform this action', 403)
        );
      }
      next();
    };
  };

exports.createAdmin = asyncErrorHandler(async (req, res, next) => {
   
    const { name, email, password, confirmPassword } = req.body;

    const newAdmin = await User.create({
    name,
    email,
    password,
    confirmPassword,
    role: 'admin'
    });

    authController.createSendResponse(newAdmin, 201, res);
 
});