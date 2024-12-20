"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const { adminconf } = require("../models/dbusers");
const dbqueries = require("../models/dbqueries");
// const {serverAdminConnection} = require("../models/user");
const nodemailer = require("nodemailer");

let userId = 0;
//TODO
//shorten async function calls
//Remove Debugging console logs

function inputValidation(bodyobj) {
  //FI Regex expressions
  const body = Object.values(bodyobj);
  console.log(bodyobj);

  for (let i = 0; i < body.length; i++) {
    console.log(body[i]);
    if (!body[i]) {
      return {
        // IF ERROR return false instead, maybe return json?
        status: "Failure",
        message: "One or more fields were absent",
      };
    } else if (body[i] === "") {
      console.log("giggity");
      return {
        status: "Failure",
        message: "One or more fields were empty",
      };
    }
    console.log(!/^[^a-z]+$/i.test(body[1]));
    if (
      body.firstName === body[i] ||
      body.lastName === body[i] ||
      body.companyName === body[i]
    ) {
      if (/^[a-z]*$/i.test(body[1])) {
        return {
          status: "Failure",
          message: "must only contain alphanumeric characters", //add specific field name
        };
      } else if (body.username === body[i]) {
        if (/^[a-z0-9]+$/i.test(body[i])) {
          return {
            status: "Failure",
            message: "must only contain alphanumeric characters", //add specific field name
          };
        }
      }
    }
  }
  return {
    status: "Success",
    message: "The input is valid",
  };
}

function signupUser(req, res) {
  /**
   * Currently contains signupCompany code. needs to only insert user into desired team.
   */
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let teamName = req.body.teamName;
  let companyName = req.body.companyName;
  console.log(firstName);
  console.log(lastName);

  const valid = inputValidation({
    firstName,
    lastName,
    username,
    email,
    password,
  });
  console.log(valid);
  if (valid.status === "Failure") {
    return res.status(400).json({ valid });
  } else {
    dbqueries.check.IfUserExists(email).then((result) => {
      console.log(JSON.stringify(result.recordset[0]) + "asdasdd");
      if (result.recordset[0]) {
        return res.status(400).json({
          status: "Failure",
          message: "An account with that email already exists",
        });
      } else {
        dbqueries.check.IfCompanyExists(companyName).then((result) => {
          if (!result.recordset[0]) {
            return res.status(400).json({
              status: "Failure",
              message: "The Company " + companyName + " does not exist",
            });
          }

          dbqueries.add
            .userToDbAddToCompanyAndTeam(
              firstName,
              lastName,
              username,
              email,
              password,
              teamName,
              companyName
            )
            .then(() => {
              console.log("WHAT????");
              return res.status(200).json({
                status: "Success",
                message: "Account was successfully created",
              });
            })
            .catch((err) => {
              console.log(
                `an error occured during signup for ${firstName} ${lastName} ${JSON.stringify(
                  err
                )}`
              );
              return res.status(500).json({
                status: "Failure",
                message: "Something went wrong, try again later",
              });
            });
        });
      }
    });
  }
}

function createTeam(req, res) {
  let teamName = req.body.teamName;
  console.log(teamName);
  let companyName = req.body.companyName;
  console.log(companyName);

  dbqueries.check.IfCompanyExists(companyName).then((result) => {
    if (!result.recordset[0]) {
      return res.status(400).json({
        status: "Failure",
        message: "The Company '" + companyName + "' does not exist",
      });
    }
    let companyID = result.recordset[0]["CompanyID"];
    dbqueries.check.IfTeamExists(teamName).then((result) => {
      if (result.recordset[0]) {
        return res.status(400).json({
          status: "Failure",
          message: "The Team '" + teamName + "' already exists",
        });
      }

      async function CreateTeam(teamName, CompanyID) {
        const connection = await sql.connect(adminconf);
        const request = connection.request();

        request.input("teamName", sql.VarChar, teamName);

        request.input("companyID", sql.Int, companyID);

        return await request.query(
          "INSERT INTO Teams (TeamName, CompanyID) VALUES (@teamName, @companyID)"
        );
      }
      CreateTeam(teamName, companyID).then(() => {
        return res.status(201).json({
          status: "Success",
          message: "Team successfully created",
        });
      });
    });
  });
}

function switchUserTeam(req, res) {
  let newTeamName = req.body.newTeamName;
  let companyID = req.user.CompanyID;
  let email = req.body.email;
  dbqueries.check.IfTeamExists(newTeamName, companyID).then((result) => {
    if (!result.recordset[0]) {
      return res.status(400).json({
        status: "Failure",
        message: "No User with this email exists",
      });
    }
    dbqueries.get.UserInfoFromEmail(email).then((result) => {
      if (!result.recordset[0]) {
        return res.status(400).json({
          status: "Failure",
          message: "No User with this email exists",
        });
      } else if (result.recordset[0]["CompanyID"] != companyID) {
        return res.status(400).json({
          status: "Failure",
          message: "You do not lead this user's company",
        });
      } else {
        let currentTeamName = result.recordset[0]["TeamName"];
        let userID = result.recordset[0]["UserID"];
        async function switchUserTeam(userID, newTeam) {
          const connection = await sql.connect(adminconf);
          const request = connection.request();

          request.input("userID", sql.Int, userID);
          request.input("newTeam", sql.VarChar, newTeam);

          return await request.query(
            "UPDATE Users SET teamName = @newTeam WHERE userID = @userID"
          );
        }
        switchUserTeam(userID, newTeamName).then((result) => {
          return res.status(200).json({
            status: "Success",
            message: "User Successfully switched teams",
          });
        });
      }
    });
  });
}

function deleteTeam(req, res) {
    let teamName = req.user.TeamName;
    let companyID = req.user.CompanyID;
    //Validate input lansludh yaddayadba doo

    async function deleteTeam(teamName, CompanyID){
      const connection = await sql.connect(adminconf);
      const request = connection.request()
      request.input("teamName", sql.VarChar, teamName);
      request.input("CompanyID", sql.Int,CompanyID);
      return await request.query("DELETE Teams WHERE TeamName = @teamName AND CompanyID = @CompanyID");

    }
    
}

function deleteCompany(req, res) {

  async function deleteTeam(CompanyID){
    const connection = await sql.connect(adminconf);
    const request = connection.request()
    request.input("CompanyID", sql.Int,CompanyID);
    return await request.query("DELETE Companies WHERECompanyID = @CompanyID");

  }
}
function addTeamLeader(req, res) {
  async function addTeamLeader(userID){
    const connection = await sql.connect(adminconf);
    const request = connection.request()
    request.input("UserID", sql.Int,userID);
    return await request.query("UPDATE Users SET isTeamLeader = 1 WHERE UserID = @UserID");

  }
}
function removeTeamLeader(req, res) {
  //Check
  async function RemoveTeamLeader(userID){
    const connection = await sql.connect(adminconf);
    const request = connection.request()
    request.input("UserID", sql.Int,userID);
    return await request.query("UPDATE Users SET isTeamLeader = 0 WHERE UserID = @UserID");

  }
}
function addCompanyLeader(req, res) {
  async function addCompanyLeader(userID){
    const connection = await sql.connect(adminconf);
    const request = connection.request()
    request.input("UserID", sql.Int,userID);
    return await request.query("UPDATE Users SET isCompanyLeader = 1 WHERE UserID = @UserID");

  }
}
function removeCompanyLeader(req, res) {
  async function removeCompanyLeader(userID){
    const connection = await sql.connect(adminconf);
    const request = connection.request()
    request.input("UserID", sql.Int,userID);
    return await request.query("UPDATE Users SET isCompanyLeader = 0 WHERE UserID = @UserID");

  }
}

function login(req, res, next) {
  let { email, password } = req.body;
  console.log(req.body);
  const valid = inputValidation(req.body);
  console.log(valid);
  if (valid["status"] == "Failure") {
    return res.status(400).json(valid);
  }

  dbqueries.check
    .ForMatchingPassword(email)
    .then(async (result) => {
      console.log(result);
      if (result.recordset.length != 0) {
        const correctPassword = await bcrypt.compare(
          password,
          result.recordset[0]["hashedpassword"]
 
        );
        console.log(correctPassword + "ASDUIBUASB" + password)
        if (correctPassword) {
          console.log("Correct password input!");
          next();
          // res.status(200).json({
          //   status: "success!",
          //   message: "User has successfully logged in"
          // });
        } else {
          return res.status(400).json({
            status: "Failure",
            message: "Incorrect password or email",
          });
        }
      } else {
        return res.status(400).json({
          status: "Failure",
          message: "No accounts match this email",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        result: "error",
        message: "Encountered an error",
      });
    });
}

function signupCompany(req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let teamName = req.body.teamName;
  let companyName = req.body.companyName;
  console.log(firstName);
  console.log(lastName);
  const valid = inputValidation({
    firstName,
    lastName,
    username,
    email,
    password,
  });
  console.log(valid);
  if (valid.status === "Failure") {
    return res.status(400).json({ valid });
  } else {
    dbqueries.check.IfUserExists(email).then((result) => {
      if (result.recordset[0]) {
        return res.status(400).json({
          status: "Failure",
          message: "An account with that email already exists",
        });
      } else {
        dbqueries.add
          .UserToDbCreateCompanyAndTeam(
            firstName,
            lastName,
            username,
            email,
            password,
            teamName,
            companyName
          )
          .then(() => {
            console.log("WHAT????");
            return res.status(200).json({
              status: "Success",
              message: "Account was successfully created",
            });
          })
          .catch((err) => {
            console.log(
              `an error occured during signup for ${firstName} ${lastName} ${JSON.stringify(
                err
              )}`
            );
            return res.status(500).json({
              status: "Failure",
              message: "Something went wrong, try again later",
            });
          });
      }
    });
  }
}

//it broken =(
function passwordReset(req, res) {
  const email = req.body.email;
  const oldpassword = req.body.oldpassword;
  const newpassword = req.body.newpassword;
  console.log(email);
  dbqueries.check
    .ForMatchingPassword(email)
    .then(async (result) => {
      console.log(result);
      if (result.recordset.length != 0) {
        const correctPassword = await bcrypt.compare(
          result.recordset[0]["hashedpassword"],
          oldpassword
        );
        if (correctPassword) {
          console.log("Correct password input!");
          console.log("changing password...");
          //change password
          dbqueries.update.resetPassword(newpassword, email).then((result) => {
            return res.status(200).json({
              status: "Success",
              message: "Password successfully updated",
            });
          });
        } else {
          return res.status(400).json({
            status: "Failure",
            message: "Incorrect password or email",
          });
        }
      } else {
        return res.status(400).json({
          status: "Failure",
          message: "No accounts match this email",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        result: "error",
        message: "Encountered an error",
      });
    });
}

function resetPassword(req, res) {
  accEmail = req.body.email;
  newPassword = req.body.password;

  //sql query UPDATE Users SET hashedPassword to bcrypt(new password) WHERE email = accEmail
}

module.exports = {
  login,
  signupUser,
  signupCompany,
  passwordReset,
  createTeam,
  switchUserTeam,
};

/*
    fetch("http://localhost:8000/signup",  
{
    "method":"post",
     "headers":{"Content-Type" : "appication/json" },
    "body":{
        "fullName" : "John Doe",
        "username" : "John45",
        "email" : "johnD@gmail.com",
        "password" : "password"
    }
})
*/
