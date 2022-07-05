

const bcrypt = require('bcryptjs');

const registerschema = require('./dbschema');




const express=require('express');
const router =express.Router();
// Importing required package
const cors=require('cors');
const mongoose=require('mongoose');
const session= require('express-session');
const MongoDBSession=require('connect-mongodb-session')(session);
const dotenv=require('dotenv');
const moviedetailsschema = require('./moviedetailschema');


dotenv.config();
const app=express();
app.use(express.json())
app.use(cors())


const URI=process.env.MONGO_URL

mongoose.connect(URI).then(()=>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on `)
        console.log(process.env.PORT)
    })
}).catch((error)=>{
    console.log(error)
})

    const store = new MongoDBSession({
        uri:URI,
        collection:'moviecookie',
    })
    
    app.use(session({
        secret:'key will sign cookie',
        resave:false,
        saveUninitialized:false,
        store:store,
    }))
    
    const isAuth =(req,res,next)=>{
        if(req.session.isAuth){
            
            next()
        }
        else{
            
            res.send("session expired please login http://localhost:5000/login ")
        }
    }

//  routers/////////////////////////////  

// register   ///   rvignesh60474@gmail.com   pswd:vignesh123
app.post('/register',async(req,res)=>{
    try {
        const {username,email,password}=req.body;
   
         let user = await registerschema.findOne({email});
         if(user){
             res.send({message:"user already exist"})        
            return res.redirect('/register');
        }
          const hashedpassword= await bcrypt.hash(password,2);
          user = new registerschema({
              username:req.body.username,
              email:req.body.email,
              password:hashedpassword
          });
          await user.save();
          res.send(user)
         // res.redirect("/login");
    } catch (error) {
        console.log(error)
    }
    
})

///dashboard

//  to login check if user exist

app.post("/login",async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await registerschema.findOne({email});
        if(!user)
        {
            return res.redirect('/login');
        }
        const ismatch=await bcrypt.compare(password,user.password);
        
        if(ismatch){
            req.session.isAuth=true;
            res.send("login success you can access update,create,delete now")
            //return res.redirect('/dashboard')

        }
        res.send("wrong password try again")
        return res.redirect('/login')
        

    } catch (error) {
        
    }
})

app.post("/addmovie",async(req,res)=>{
    
    addmovie= new moviedetailsschema(req.body)
    movie = new moviedetailsschema(
        req.body
    );
    await movie.save();
    res.send(movie)


})

app.get("/allmovie",async(req,res)=>{
    allmovie=await moviedetailsschema.find({});
    res.send(allmovie)
})
app.delete("/delete/:id",isAuth,async(req,res)=>{
    deletemovie= await moviedetailsschema.findByIdAndDelete(req.params.id)
    res.send(deletemovie,"movie deleted")
})

app.put("/update/:id",isAuth,async(req,res)=>{
try {
    update=await moviedetailsschema.findByIdAndUpdate(req.params.id,req.body)
    if(update)
    res.send(update)
} catch (error) {
    console.log(error)
}

})
app.post('/logout',async(req,res)=>{
    req.session.destroy()
    res.send("logout completed cookie deleted from mongodb")
})