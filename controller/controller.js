const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const mongoose = require("mongoose");
const { model } = require("../model/model");
const bcrypt = require("bcrypt");
const csvParser  = require('csv-parser');
const fs = require('fs');

const csvFilePath = './data.csv';

 exports.sendData = (city,count) =>{
  const streatName = [];
   const name = [];
  return new Promise((resolve, reject) => {

    fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data',(row)=>{
      if(row.도로명전체주소.includes(city)){
        if(row.도로명전체주소.includes(count)){
          if(row.좌표정보x !=='' && row.좌표정보y !== ''){
            name.push(row.도로명전체주소);
            streatName.push(row.도로명전체주소);
          }
        }
      }
    }).on('end',()=>{
      console.log('Funtion executed without errors');
         resolve({name:name,streatName:streatName});
    }) .on('error', (err) => {
      console.error('Error reading CSV file:', err);
    });
  })
}

exports.statusCodeFunction = async (statusCode) => {
  return new Promise((resolve, reject) => {
    if (statusCode === 200) {
      resolve({ 200: "ok" });
    } else if (statusCode === 400) {
      resolve({ 400: "Bad Request" });
    } else if (statusCode === 401) {
      resolve({ 401: "Unauthorized" });
    } else if (statusCode === 404) {
      resolve({ 404: " Not Found" });
    } else if (statusCode === 500) {
      resolve({ 500: "Internal Server Error" });
    }
  });
};



exports.findUsers = (id) => {
  return new Promise(async (resolve, reject) => {
    let returnStatement;

    await model
      .findOne({ id: id })
      .then((docs) => {
        docs === null
          ? (returnStatement = "User Not Found.")
          : (returnStatement = "Existing User.");
      })
      .catch((error) => {
        console.error(error);
        returnStatement = "Error occured While Finding User.";
      });
    returnStatement === "Error occured While Finding User."
      ? reject(returnStatement)
      : resolve(returnStatement);
  });
};

// Registration function
exports.Registration = (name, id, password,email) => {
  return new Promise(async (resolve, reject) => {
    const UserExist = await this.findUsers(id).catch(
      (PromiseRejectionEvent) => {
        PromiseRejectionEvent;
      }
    );

    if (UserExist === "Error occured While Finding User.")
      return reject("Internal Server Error.");

    if (UserExist === "Existing User.") {
      resolve("Already Existing User.");
      return;
    } else {
      const encrypted_password = bcrypt.hashSync(password, 10);
      model
        .insertOne({
          name: name,
          id: id,
          password: encrypted_password,
          email: email,
        })
        .then(resolve("Successfully Registered."))
        .catch((error) => {
          console.error(error);
          reject("Internal Server Error.");
        });
    }
  });
};

// login function
exports.Login = (id, pw) => {
  return new Promise(async (resolve, reject) => {
    const UserExist = await this.findUsers(id);

    if (UserExist === "Error occured While Finding User.")
      return reject("Internal Server Error.");

    if (UserExist === "Existing User.") {
      model
        .findOne({ id: id })
        .then(docs=>{
          if(bcrypt.compareSync(pw,docs.password)){
            resolve(["Successfully Loged In.",docs])
          }else{
            resolve("Wrong Password.")
          }
        }) 
        .catch((error) => {
          console.error(error);
          resolve(error);
        });
    } else if (UserExist === "User Not Found.") {
      resolve(UserExist);
    }
  });
};

// millitery webScraping function
exports.militeryScrape = async (url, selector) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const element = $(`${selector}`).toArray();
        const result_array = [];
        const href_array = [];
        console.log("genre:", element);
        element.forEach(element=>{
          console.log(result_array.push(element.children[0].data))
          console.log(href_array.push(element.parent.attribs.href))
        })
        resolve([result_array,href_array]);
      });
    } catch (error) {
      console.error("Error", error);
      resolve(error.message);
    }
  });
};