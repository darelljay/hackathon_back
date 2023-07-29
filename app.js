require("dotenv").config();
const express = require("express");
const router = require("./router/router");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
  })
);

app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",router);
app.listen(process.env.PORT || 8080,async (req, res) => {
    console.log(`server is runnig on port ${process.env.PORT || 8080}`);
  });
