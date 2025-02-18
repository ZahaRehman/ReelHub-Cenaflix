
const customError = require('./../Utils/customError')

const prodErrors = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    }else {
        res.status(500).json ({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        })
    }
}

const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const castErrorHandler =(err)=>{
    const msg= `Invalid value ${err.value} for field ${err.path}!`
    return new customError(msg,400)
}

module.exports= (error, req,res,next)=>{ 
    error.statusCode= error.statusCode || 500;
    error.status= error.status ||'error';
     
    if(process.env.NODE_ENV === 'development'){
        devErrors(res, error);
    }else if(process.env.NODE_ENV === 'production'){
        
       
        if(error.name==='CastError'){
            error= castErrorHandler(error);
        }
        prodErrors(res, error);
    }
}