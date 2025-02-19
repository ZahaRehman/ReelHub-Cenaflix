const express= require('express');
const morgan = require('morgan');
const moviesRouter= require('./Routes/moviesRoutes');
const CustomError= require('./Utils/customError');
const globalErrorHandler= require('./Controller/errorController')
const authRouter= require('./Routes/authRouter')
const rateLimit= require('express-rate-limit')
const userRoute= require('./Routes/userRoute')
const adminRouter = require('./Routes/adminRouter')

let app= express();

let limite= rateLimit({
    max:3,
    windowMs: 60*60*1000,
    message: 'We have recieved too many request from this IP'
});

app.use('./api',limite);
app.use(express.json());
app.use(express.static('./public'));

app.use("/api/v1/movies",moviesRouter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin", adminRouter);


app.all('*',(req,res,next)=>{
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
    next(err);

})

app.use(globalErrorHandler)


const logger= function (req,res,next){
    console.log("custom logger");
    next();
}
app.use(logger)
module.exports= app