const express = require("express");

const session = require("express-session");
const {
    militeryScrape,
    signUp,
    statusCodeFunction,
    findUsers,
    signIn,
    Registration,
    Login,
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
      req.session.user = {
        name:name,
        id:id
      }
      req.session.save(()=>{
          res.status(200).json(registration);
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
      req.session.user ={
        name:login[1].name,
        id:login[1].id,
      } 
      req.session.save(()=>{
          res.status(200).json(login[0]);
      });

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
  res.status(200).json("Successfully Loged out");
});

router.get("/", (req, res) => {
  res.status(200).json("ok");
});

router.get("/auth", async(req, res) => {
    console.log(auth(req,res));
    if( auth(req,res)){
          const user = req.session.user
          res.status(200).send(user);
    }else{
        res.status(409).json("User Not Autherized");
    }
});

module.exports = router;
