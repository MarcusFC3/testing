

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


app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet())


console.log(JSON.stringify(process.env) + "URL")
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: true, sameSite: "none", maxAge:  60 * 60 * 1000},
  store: sqlstore,

}));

app.use(passport.initialize())
app.use(passport.session())

passport.use('local', new Strategy({
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
    console.log("LOCAL STRATEGY" + JSON.stringify(result.recordset[0]))
    let user = result.recordset[0]
   done(null,JSON.stringify(user))
  }).catch(
    (err)=>{
      done(null,  err)
    }
  )

  }

//
  
)); 

passport.serializeUser(
  (user, done)=>{
    console.log("SERIALIZING" + user)
  
    console.log("working")

   done(null, JSON.parse(user))
  
   
  
   
 //{"cookie":{"originalMaxAge":3600000,"expires":"2024-11-21T19:38:26.272Z","secure":true,"httpOnly":true,"path":"/","sameSite":"none"},"passport":{"user":{}}}

});


//FIX ERROR 

passport.deserializeUser((user, done)=>{
  try{
  console.log("DESERIALIZING" )
  let userID = user["UserID"]
   db.get.UserInfoFromUserID(userID).then(
     (result) =>{
      console.log("DESERIALIZING 2222222")
        user = result.recordset[0]
        console.log(JSON.stringify(result))
        console.log("DESERIALIZING 4444")
        done(null, user)
     }
  ).catch(
    (err)=>{
      console.log("BD" + err )
      done(null, err)
    }
  )
  
}catch(e){
  console.log(e)
  done(null, e)
}
})


app.use(cors())
app.options("*", cors())

function checkLoggedIn(req, res, next){
  console.log(req.session)
  if (!req.session.passport){
    return res.status(401).json({
      error: "You must login",
      session: req.session
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


//login routes
app.post("/api/login", (req, res, next) =>{
  res.send("Move naw naw waht?")
}, passport.authenticate('local'), (req, res) => {
    // This code runs after authentication has been completed
  
    console.log("Authentication successful");
  
    // You can now safely send a response, since the user has been authenticated
    return res.status(200).json({
      message: "Authentication successful",
      user: req.user  // You can access the authenticated user from req.user
    });
  });

app.post("/pwdreset", loginController.passwordReset)



app.post("/signup/user", loginController.signupUser)//maybe allow leaders to signup users with this?

app.post("/signup/company", loginController.signupCompany)

app.post("/create/team", loginController.createTeam)

app.post("/changeteam", loginController.switchUserTeam)

function createSession(req, res) {

}
module.exports = loginRouter; 


app.use("/user", userRouter);
app.get("/api", (req, res) => {return res.send("hyecuh")})    

app.get("/logout", (req, res) =>{
  req.logout(()=>{
    return res.redirect("/")
  });

})
const PORT = process.env.PORT || 3000;;
app.listen(PORT, ()=>{
  console.log("Server started listening on port " + PORT)
})
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