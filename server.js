const mongoose = require('mongoose')

const app= require('./app')

const dotenv = require('dotenv')
dotenv.config({path : './config.env'})

console.log(process.env);

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn)=>{
    //console.log(conn);
    console.log("DB Connection Successful");;
})


const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server has started.....!"); 
})
