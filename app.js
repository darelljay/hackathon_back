require("dotenv").config();
const express = require("express");
const router = require("./router/router");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({mongoUrl:process.env.DB_URL}), 
    cookie:{maxAge:(3.6e+6)*24} 
  })
);
  
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS']
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",router);

app.listen(process.env.PORT || 8080,async (req, res) => {
    console.log(`server is runnig on port ${process.env.PORT || 8080}`);
  });
