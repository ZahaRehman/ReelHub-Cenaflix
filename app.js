const express= require('express');
const morgan = require('morgan');
const moviesRouter= require('./Routes/moviesRoutes');
const CustomError= require('./Utils/customError');
const globalErrorHandler= require('./Controller/errorController')
const authRouter= require('./Routes/authRouter')


let app= express();
app.use(express.json());
app.use(express.static('./public'))

app.use("/api/v1/movies",moviesRouter)
app.use("/api/v1/users",authRouter)




app.all('*',(req,res,next)=>{
    // const err= new Error(`Can't find ${req.originalUrl} on the server`);
    // err.status='fail';
    // err.statusCode= 404;

    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
    next(err);

})

app.use(globalErrorHandler)

// if(process.env.NODE_ENV==='development')
//     {
//         app.use(morgan('dev')) 
//     }
        
//     app.use((req,res,next)=>{
//         req.requestedAt= new Date().toISOString();
//         next();
//     })    
    

    

const logger= function (req,res,next){
    console.log("custom logger");
    next();
}
app.use(logger)
module.exports= app