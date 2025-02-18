const User= require('./../Models/userModal');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt= require('jsonwebtoken')
const customError= require('./../Utils/customError');
const CustomError = require('./../Utils/customError');
const { promisify } = require('util');
const sendEmail= require('./../Utils/email')

const signToken= id=>{
    return jwt.sign({id: id},process.env.SECRET_STR,{
        expiresIn: process.env.LOGIN_EXPIRES
    })
}


exports.signup=asyncErrorHandler(async (req, res, next)=>{
    const newUser =await User.create(req.body)
    
    const token = signToken(newUser._id)
    
    res.status(201).json({
        status: 'success',
        token,
        data:{
            user: newUser
        }

    });
});

exports.login= asyncErrorHandler(async(req,res,next)=>{
    const email= req.body.email;
    const password= req.body.password

    if(!email || !password){
        const error= new CustomError("please provide email & password for loging in", 400)
        return next(error);
    
    }

    const user= await User.findOne({email});
    

    // const isMatch= await user.comparePasswordInDb(password, user.password)
    
    // const{email, passowrd}= req.body;
    if(!user|| !(await user.comparePasswordInDb(password, user.password))){
        const error= new customError('incorrect email or password', 400)
        return next(error)
    }

    const token = signToken(user._id);


    res.status(200).json({
        status: 'success',
        token
    });
    
});
exports.protected = asyncErrorHandler(async (req, res, next) => {
    const testToken = req.headers.authorization;
    let token;

    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1];
    }

    if (!token) {
        return next(new customError("You are not logged in", 401));
    }

    // Validate the token
    const decodedToken = await promisify(jwt.verify)(token, process.env.SECRET_STR);

    // Find the user and ensure it's an actual document
    const user = await User.findById(decodedToken.id); // ✅ Await added here

    if (!user) {
        return next(new customError("The user with the given token does not exist", 401));
    }

    // Check if the password has been changed
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);

    if (isPasswordChanged) {
        return next(new customError('The password has been changed recently, please login again', 401));
    }

    req.user = user;
    next();

});


exports.restrict = (...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role) ){
            const error = new customError("you donot have the access to perform this operation", 403)

            next(error);
        }
        next();
    }
}  


exports.forgotPassword= asyncErrorHandler(async (req,res,next)=>{
    const user= await User.findOne({email: req.body.email})

    if(!user){
        const error = new customError("could not find a user", 404)
        next(error);
    }

    const resetToken= user.createResetPasswordToken();
    console.log(resetToken);
    await user.save({validateBeforeSave:false});

    const resertUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
    const message=`we have recieved the reset passwprd req \n\n${resertUrl}`
    
    try{
    await sendEmail({
        email: user.email,
        subject: "password change",
        message: message
    })
    res.status(200).json({
        status: "success",
        message: "Password reset email sent to the user"
    })
    }catch(err){
        user.passwordResetToken=undefined
        user.passwordResetTokenExpire= undefined
        user.save({validateBeforeSave: false});

        return next(new customError("there was an error sending password reset email ",500))
    }
})

exports.resetpassword=(req,res,next)=>{

}