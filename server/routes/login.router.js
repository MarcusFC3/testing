"use strict"

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const MssqlStore = require("connect-mssql-v2");
const helmet = require("helmet");
const sanitizer = require("perfect-express-sanitizer");
const cookieSession = require("cookie-session");
const passport = require("passport");
const {Strategy} = require("passport-local");

const loginController = require("../controllers/login.controller"); 

const loginRouter = express.Router();



loginRouter.post("/", loginController.login, passport.authenticate('local'), (req, res) => {
    // This code runs after authentication has been completed
  
    console.log("Authentication successful");
  
    // You can now safely send a response, since the user has been authenticated
    return res.status(200).json({
      message: "Authentication successful",
      user: req.user  // You can access the authenticated user from req.user
    });
  });

loginRouter.post("/pwdreset", loginController.passwordReset)



loginRouter.post("/signup/user", loginController.signupUser)//maybe allow leaders to signup users with this?

loginRouter.post("/signup/company", loginController.signupCompany)

loginRouter.post("/create/team", loginController.createTeam)

loginRouter.post("/changeteam", loginController.switchUserTeam)

function createSession(req, res) {

}
module.exports = loginRouter; 