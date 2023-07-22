require('dotenv').config();
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");
const DB_URL = process.env.DB_URL;
const client = new MongoClient(DB_URL);
const database = client.db();
const Collection = database.collection("Users");

const conn = async () => {
    try {
      const connection = mongoose.connection;
      connection.once("open", () => {
        console.log("MongoDB datebase connection established successfully.");
      });
      await mongoose.connect(DB_URL, {
        tls:true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology: true,
      });
      console.log("connected to database");
    } catch (err) {
      console.log(err);
    }
  };

conn()
exports.model = Collection;