const mongoose= require('mongoose')

const moviedetails =mongoose.Schema({
    Movie_Name:{
        type:String,
        
    },
    	Rating :{
        type:String,
    },
    	Cast :{
        type:Array,
       
    },
    Genre:{
        type:String
    },
    releaseDate:{
        type:Date
    }

})
const moviedetailsschema =mongoose.model("moviedetails",moviedetails)
module.exports=moviedetailsschema;