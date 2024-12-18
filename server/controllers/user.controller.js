const express = require("express");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const { adminconf } = require("../models/dbusers")
const dbqueries = require("../models/dbqueries");
// const {serverAdminConnection} = require("../models/user");
const nodemailer = require("nodemailer");


function getUserData(req, res){
   const userID = req.session.passport.user.UserID;
   dbqueries.get.UserInfoFromUserID(userID).then(
      (result) =>{
         return result.recordset[0]
      }
   )

}

function deleteUser(req, res) {
   let email = req.body.email
   if (!email) {
      return res.status(400).json({
         status: "Failure",
         message: "No 'email' property was sent in request body"
      });

   }
   async function deleteUser(email) {
      const connection = await sql.connect(adminconf);
      const transaction = connection.transaction();
      const request = transaction.request();
      request.input("email", sql.VarChar, email);
      await transaction.begin();
      try{

         await request.query("DELETE UserActivities WHERE UserID = (SELECT UserID FROM Users WHERE email = @email)");
         await request.query("DELETE Users WHERE email = @email");
         transaction.commit();
      }
      catch(err){
         await transaction.rollback();
         return err
      }
      }
     
   deleteUser(email).then(
      (response) => {
         console.log(response)
         res.status(200).json({
            status: "Success",
            message: "User successfully deleted"
         })
      }
   ).catch((err) => {
      console.log(err);
      res.status(500).json({
         status: "Failure",
         message: "An error occurred"
      })
   })
}


module.exports = {
   deleteUser,
   getUserData,
}
