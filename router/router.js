const express = require("express");
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
    res.status(200).json(registration);
    req.session.name = name;
    req.session.Userid = id;
    req.session.email = email;
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
    res.status(400).json(login[0]);
  } else if (login[0] === "Successfully Loged In.") {
      req.session.name = login[1].name;
      req.session.Userid = login[1].id;
      req.session.email = login[1].email;
    
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

router.get("/auth", (req, res) => {
    if(req.session.name !== undefined){
        const UserInfo = {
            name: req.session.name,
            id: req.session.Userid,
            email: req.session.email,
          };
          res.status(200).send(UserInfo);
    }else{
        res.status(409).json("User Not Autherized");
    }
});

module.exports = router;
