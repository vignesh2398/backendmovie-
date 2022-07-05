const mongoose= require('mongoose')

const register =mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    username:{
        type:String,
        unique:true
    }
    
})
const registerschema =mongoose.model("movieuser",register)
module.exports=registerschema;