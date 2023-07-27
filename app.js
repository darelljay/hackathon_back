require("dotenv").config();
const express = require("express");
const router = require("./router/router");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",router);


app.listen(process.env.PORT || 8080,async (req, res) => {
    console.log(`server is runnig on port ${process.env.PORT || 8080}`);
  });
