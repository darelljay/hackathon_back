const express = require("express");

let isLogin = false;
let user = {
  name:'',
  id:'',
  email:''
}

const session = require("express-session");
const {
    militeryScrape,
    signUp,
    statusCodeFunction,
    findUsers,
    signIn,
    Registration,
    Login,
    sendData,
} = require("../controller/controller");


const router = express.Router();


require("dotenv").config();

const auth = (req,res) =>{
  console.log(req.session.user)
    if(req.session.user !== undefined){
        return true;
    }else{
        return false;
    }
}



router.post("/scrape1", async (req, res) => {
  const { url, selector } = req.body;

  res.send(JSON.stringify(await militeryScrape(url, selector)));
});

router.post('/sendLocation',async(req,res)=>{
  const {city,cnt} = req.body;

  const result = await sendData(city,cnt);
  
  res.status(200).send(result);

});

router.post("/registration", async (req, res) => {
  const { name, id, password, email } = req.body;
  const registration = await Registration(name, id, password, email).catch(
    (PromiseRejectionEvent) => {
      PromiseRejectionEvent;
    }
  );

  if (registration === "Already Existing User.") {
    res.status(400).json(registration);
  } else if (registration === "Successfully Registered.") {
    req.session.save(()=>{
        req.session.user = {
          name:name,
          id:id
        }
          res.status(200).json(registration);
          isLogin = true;
      user.name = name;
      user.id = id;
      user.email = email;
      });

  } else {
    res.status(500).json(registration);
  }
});

router.post("/Login", async (req, res) => {
  const { id, password } = req.body;
  const login = await Login(id, password).catch((PromiseRejectionEvent) => {
    PromiseRejectionEvent;
  });
  
  if (login === "User Not Found." || login === "Wrong Password.") {
    res.status(400).json(login);
  } else if (login[0] === "Successfully Loged In.") {
    req.session.save(()=>{

        req.session.user ={
          name:login[1].name,
          id:login[1].id,
        } 
          res.status(200).json(login[0]);
      });
      isLogin = true;
      user.name = login[1].name;
      user.id = login[1].id;
      user.email = login[1].email;
  } else if (login === "Internal Server Error.") {
    res.status(500).json("Internal Server Error");
  } else {
    console.error(login);
  }
});

router.post("/Logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        }
     });
     isLogin = false;
     user.name = '';
     user.id = '';
     user.email = '';
  res.status(200).json("Successfully Loged out");
});

router.get("/isLogin", (req, res) => {
  const UserObj = {
    isLogin:isLogin,
    userInfo:user
  }

  res.status(200).json(isLogin===false? false:UserObj);
});

router.get("/auth", async(req, res) => {
    console.log(auth(req,res));
    if( auth(req,res)){
          const user = req.session.user
          res.status(200).json(user);
    }else{
        res.status(200).json(false);
    }
});

router.get("/findShelter",(req,res)=>{
  console.log(req.query);
  const streat = req.query.streat;

  res.render("giveUp",{streat});
})

module.exports = router;
