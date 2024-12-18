"use strict"

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const MssqlStore = require("connect-mssql-v2");
const helmet = require("helmet");
const sanitizer = require("perfect-express-sanitizer");
const passport = require("passport");
const {Strategy} = require("passport-local");
const bodyParser = require("body-parser");
const sql = require("mssql");


const { adminconf } = require("../models/dbusers");
const db = require("../models/dbqueries");


const userRouter = require("../routes/user.router");
const activitiesRouter = require("../routes/activities.router");
const loginRouter = require("../routes/login.router");

const app = express();

const sqlstore = new MssqlStore(adminconf)

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet())



app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: true, sameSite: "none",maxAge:  60 * 60 * 1000},
  store: sqlstore,

}));
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Strategy({
  usernameField: "email",
},
  (email, password, done) =>{
    let failed = false;
    async function getUserSessionData(){
      const connection = await sql.connect(adminconf);
      const request = connection.request()
      request.input("email", sql.VarChar, email)
      return await request.query("SELECT UserID FROM Users WHERE email = @email")
      
    }
   getUserSessionData().then((result) =>{
    let user = result.recordset[0]
    done(null,JSON.stringify(user))
  }).catch(
    (err)=>{
      return done("it buggin :(" + err)
    }
  )

  }

//
  
)); 

passport.serializeUser(
  (user, done)=>{
    console.log("asdpjasdj" + user)
  user = JSON.parse(user)
   return done(null, user)
 //{"cookie":{"originalMaxAge":3600000,"expires":"2024-11-21T19:38:26.272Z","secure":true,"httpOnly":true,"path":"/","sameSite":"none"},"passport":{"user":{}}}

});


//FIX ERROR 
try{
passport.deserializeUser((user, done)=>{
  console.log(JSON.stringify(user))
  const userID = user.UserID;
  db.get.UserInfoFromUserID(userID).then(
     (result) =>{
        user = result.recordset[0]
        console.log(JSON.stringify(user))
        return done(null, user)
     }
  )
  
})}
catch(err){
  console.log(err + "IT BROKE NO")
}



function checkLoggedIn(req, res, next){
  console.log(req.session)
  if (!req.session.passport){
    return res.status(401).json({
      error: "You must login"
    })
  }
  next();
}
/**
 * 
 * Take a look at how stored procedure's may be able to stop sql injection
 */
function checkPermissions(req, res, next){
  const permissions = true;
  if (!permissions){
    return res.status(401).json({
      error: "You must login"
    })
  }
  next();
}


app.use(morgan('combined'));

app.use(
    sanitizer.clean({
      xss: true,
      noSql: true,
      sql: true,
      sqlLevel: 5,
      noSqlLevel: 5, 
    })
  );

//possibly add this to login router/controller?
app.get("/auth/google", (req, res) => { //endpoint for google authentication

} )

app.get("/auth/google/callback", (req, res) =>{

})
app.get("/asd", (req, res)=>{
  res.send(req.session.passport.user)

})

app.use("/activities", checkLoggedIn, activitiesRouter)
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {return res.send(req.user)})    

app.get("/logout", (req, res) =>{
  req.logout(()=>{
    return res.redirect("/")
  });

})
module.exports = app;
// fetch(
//   "login",
  
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         "email": "22936@my4County.com",
//         "password": "konrad222"
//     })
//     }
// )