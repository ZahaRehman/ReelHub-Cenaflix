const mongoose= require('mongoose');
const validator= require('validator');
const bcrypt= require('bcryptjs')
const crypto= require('crypto');
const { stringify } = require('querystring');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "please enter your name"]
    },
    email:{
        type: String,
        required:[true, "please enter your email"],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, "Please enter a valid email"] 
    },
    photo: {type: String},
    role:{
        type: String,
        enum:['user', 'admin'],
        default: 'user'

    },
    password:{
        type: String,
        required:[true, "please enter your password"],
        minlength: 8,
        // select : false
    },
    confirmPassword:{
        type: String,
        required:[true, "please confirm your password"],
        validate:{
            validator: function(val){
                return val== this.password;
            },
            message: "password and confirm password does not match!"

        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password= await bcrypt.hash(this.password, 12); 
    this.confirmPassword= undefined;
    next();

})

userSchema.methods.comparePasswordInDb= async function(pswd, pswdDB){
    return await bcrypt.compare(pswd, pswdDB)
}

userSchema.methods.isPasswordChanged=async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const pawdChangedTimestamp= parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(pawdChangedTimestamp, JWTTimestamp);
        return JWTTimestamp < pawdChangedTimestamp;
    }
    return false;
}

userSchema.methods.createResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex')
    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpire= Date.now()+10*60*1000
    return resetToken
}

const user= mongoose.model('User', userSchema);

module.exports= user;