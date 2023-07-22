const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");
require('dotenv').config();
const DB_URL = process.env.DB_URL;
const client = new MongoClient(DB_URL);
const database = client.db();
const Collection = database.collection("Users");

exports.model = Collection;