const User= require('./../Models/userModal');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt= require('jsonwebtoken')
const customError= require('./../Utils/customError');
const CustomError = require('./../Utils/customError');
const { promisify } = require('util');
const sendEmail= require('./../Utils/email')
const crypto= require('crypto')


const authController= require('./authController')


exports.getAllUsers= asyncErrorHandler(async(req,res,next)=>{
    const users= await User.find();

    res.status(200).json({
        status: 'success',
        result: users.length,
        data:{
            users
        }
    })
})

const filterReqObj= (obj, ...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(prop=>{
        if(allowedFields.includes(prop))
            newObj [prop]= obj[prop];
    })
    return newObj;
}

exports.updateMe= asyncErrorHandler(async (req, res, next)=>{

    if(req.body.password || req.body.currentPassword){
        return next(new customError("you can not update you password using this endpoint", 400))
    }

    const filterObj= filterReqObj(req.body, 'email', 'name')
    const updatedUser= await User.findByIdAndUpdate(req.user.id, filterObj, {runValidators: true, new : true});
    
    res.status(200).json({
        status: "success", 
    })

})


exports.deleteMe= asyncErrorHandler(async(req,res,next)=>{

    await User.findByIdAndUpdate(req.user.id, {active:false})

    res.status(200).json({
        status: "success",
        data: null 
    })

})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }
      next();
    };
  };



exports.addToWatchlist = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id; // assuming req.user is populated from auth middleware
    const { movieId } = req.body;

    // Use $addToSet to prevent duplicates
    const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { watchlist: movieId } },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'success',
        data: { watchlist: user.watchlist }
    });
});


exports.removeFromWatchlist = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { movieId } = req.params;

    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { watchlist: movieId } },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        data: { watchlist: user.watchlist }
    });
});


