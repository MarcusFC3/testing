const express = require("express");

const userController = require("../controllers/user.controller")

const userRouter = express.Router();

userRouter.get("/data", function(req, res){
    if(!req.session.passport){
        return res.status(400).json({message: "Session does not exist"});
    }else{

    
    return res.status(200).json(req.session.passport.user);
    }
})

userRouter.post("/del/usr",userController.deleteUser)
module.exports = userRouter
