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
      return 200;
    } else {
      return 401;
    }
  }
  
router.post('/scrape1',async (req,res)=>{
    const {url,selector} = req.body;

    res.send( await militeryScrape(url,selector));
});

router.post('/registration',async(req,res)=>{

    const {name,id,password,phoneNumber,gender,birthday} = req.body;
    const registration = await Registration(name,id,password,phoneNumber,gender,birthday).catch(PromiseRejectionEvent=>{PromiseRejectionEvent});

    if(registration === "Already Existing User."){
        res.status(400).json(registration);
    }else if(registration === "Successfully Registered."){
        res.status(200).json(registration);
    }else{
        res.status(500).json(registration);
    }
});

router.post('/Login',async(req,res)=>{
    const {id,password} = req.body;
    const login = await Login(id,password).catch(PromiseRejectionEvent=>{PromiseRejectionEvent});

    if(login === "User Not Found." || login === "Wrong Password."){
        res.status(400).json(login);
    }else if(login === "Successfully Loged In."){
        res.status(200).json(login);
        session.id = id;
        session.password = password;
    }else if (login === "Internal Server Error."){
        res.status(500).json("Internal Server Error");
    }else{
        console.error(login)
    }
});

router.get('/',(req,res)=>{
    console.log(session.id);
    console.log(session.password);
    res.status(200).json('ok');
})


module.exports = router;
