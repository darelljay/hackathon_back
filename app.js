const express = require("express");
const router = require("./router/router");
const app = express();

const bodyParser = require("body-parser");
const { conn, findUsers, Registration, Login } = require("./controller/controller");

const bcrypt = require('bcrypt');
const DB_URL = process.env.DB_URL;

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",router);


app.listen(process.env.PORT || 8080,async (req, res) => {
    conn(DB_URL);
    console.log(`server is runnig on port ${process.env.PORT || 8080}`);
  });
