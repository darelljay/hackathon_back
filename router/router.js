const express = require('express');
const { militeryScrape, signUp, statusCodeFunction, findUsers, signIn, Registration, Login } = require('../controller/controller');
const router = express.Router();
const session = require("express-session");
const app = express();
require("dotenv").config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
    },
    name:'connect.sid'
 }));
 
 const auth = (req, res) => {
    if (session && session.id) {
      return session.UserInfo;
    } else {
      return 401;
    }
  }
  
router.post('/scrape1',async (req,res)=>{
    const {url,selector} = req.body;

    res.send(JSON.stringify(await militeryScrape(url,selector)));
});

router.post('/registration',async(req,res)=>{

    const {name,id,password,email} = req.body;
    const registration = await Registration(name,id,password,email).catch(PromiseRejectionEvent=>{PromiseRejectionEvent});

    if(registration === "Already Existing User."){
        res.status(400).json(registration);
    }else if(registration === "Successfully Registered."){
        res.status(200).json(registration);
        session.Info = {
            name:name,
            id:id,
            password:password,
            email:email
        }
    }else{
        res.status(500).json(registration);
    }
});

router.post('/Login',async(req,res)=>{
    const {id,password} = req.body;
    const login = await Login(id,password).catch(PromiseRejectionEvent=>{PromiseRejectionEvent});
   
    if(login === "User Not Found." || login === "Wrong Password."){
        res.status(400).json(login[0]);
    }else if(login[0] === "Successfully Loged In."){
        res.status(200).json(login[0]);
        session.Info ={
            name:login[1].name,
            id:login[1].id,
            email:login[1].email,
            password:login[1].password
        }
    }else if (login === "Internal Server Error."){
        res.status(500).json("Internal Server Error");
    }else{
        console.error(login)
    }
});

router.post('/logout',(req,res)=>{
    req.session.destroy(
        (error)=>{
            if(error){
                res.status(503).json("failed logout")
            }else{
                res.status(200).json("Successfully LogedOuts")
            }
        }
    );
})

router.get('/',(req,res)=>{
    res.status(200).json('ok');
});

router.get('/auth',(req,res)=>{
    if(session.Info === undefined){
        res.status(409).json('User Not Autherized')
    }else{
        res.status(200).send(session.Info);
    }
});

module.exports = router;

