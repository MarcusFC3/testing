const express = require("express");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const { adminconf } = require("../models/dbusers");
const { DATE } = require("mysql/lib/protocol/constants/types");


//personal activities

//team activities: will give each person on the team the activity.
//there will also be a central team activity which tracks how many relevant 
//individual activities have been completed
//

/*
 * Company activites will give each team a team activity and have a central 
 * company activity which tracks how many relevant team activites have been completed 
 */


function getUserActivityData(req, res) {
    console.log(req.user)
    if (!req.session.passport) {
        res.status(400).json({
            status: "Failure",
            message: "You must login to view activity data"
        })
    } else{
        async function getUserActivities(UserID) {
            const connection = await sql.connect(adminconf);
            const request = connection.request();
            request.input("UserID", sql.Int, UserID);
            return await request.query("SELECT UserActivities.*, TeamActivities.CompanyActivityID FROM UserActivities LEFT OUTER JOIN TeamActivities ON UserActivities.TeamActivityID = TeamActivities.ActivityID WHERE UserID = 8")
            }
        getUserActivities(req.session.passport.user.UserID).then((results) => {
            return res.status(200).json({
                "status": "success",
                "UserActivites": results.recordset
            })
        })
    }
}
function viewTopTeams(req, res) {
if (!req.session.passport) {
    res.status(400).json({
        status: "Failure",
        message: "You must login to view the leaderboard"
    })
} else{
    async function getTeamsData(CompanyID) {
        const connection = await sql.connect(adminconf);
        const request = connection.request();
        request.input("CompanyID", sql.Int, CompanyID);
        return await request.query("SELECT TeamName FROM Teams WHERE CompanyID = @CompanyID").then(
            async (result) => {
                let StatsByTeam = {}
                    
                    await request.query("SELECT * FROM TeamActivities WHERE CompanyID = @CompanyID").then((result) => {
                       
                        for (let i = 0;  result.recordset.length > i; i++){
                            let tname = result.recordset[i]["TeamName"]
                            StatsByTeam[tname] = {
                                Completed: 0,
                                Started: 0
                            }
                            
                        }
                        for (let i = 0;  result.recordset.length > i; i++){
                            let tname = result.recordset[i]["TeamName"]
                            if (result.recordset["Completed"]){
                                StatsByTeam[tname].Completed++;
                                StatsByTeam[tname].Started++;
                            }else {
                                StatsByTeam[tname].Started++;
                            }
                            
                            
                            
                        }
                        

                    })
                    return StatsByTeam;
                
            } 
        )
    }
    getTeamsData(req.user.CompanyID).then((StatsByTeam) => {
        console.log(StatsByTeam);
        return res.status(200).json({
            "status": "success",
            "StatsByTeamID": StatsByTeam
        })
    })
}
}
function viewTopUsers(req, res) {
 
    async function getUsersData(CompanyID) {
        const connection = await sql.connect(adminconf);
        const request = connection.request();
        request.input("CompanyID", sql.Int, CompanyID);
        return await request.query("SELECT UserID, firstName + ' ' + lastName as FullName FROM Users WHERE TeamName in (SELECT TeamName FROM Teams Where CompanyID = @CompanyID)").then(
           
            async (result) => {
                console.log(JSON.stringify(result.recordset))
                users = result.recordset

                StatsByUser = {}
                await request.query("SELECT UA.Completed, Users.firstName + ' ' + Users.lastName as fullName FROM UserActivities as UA JOIN Users ON UA.UserID = Users.UserID WHERE CompanyID = @CompanyID").then((result) => {
                console.log("query results are:  " + JSON.stringify(result.recordset))
                
                for (let i = 0;  result.recordset.length > i; i++){
                    let fname = result.recordset[i]["fullName"]
                    StatsByUser[fname] = {
                        Completed: 0,
                        Started: 0
                    }
                    
                }
                for (let i = 0;  result.recordset.length > i; i++){
                    let fname = result.recordset[i]["fullName"]
                    if (result.recordset["Completed"]){
                        StatsByUser[fname].Completed++;
                        StatsByUser[fname].Started++;
                    }else {
                        StatsByUser[fname].Started++;
                    }
                    
                    
                    
                }
                

            })
                 
                return StatsByUser;
            }
        )
    }
    getUsersData(req.user.CompanyID).then((StatsByUser) => {
        console.log(StatsByUser);
        return res.status(200).json({
            "status": "success",
            "StatsByUser": StatsByUser
        })
    })
    }

function createUserActivity(req, res) {
    let date = new Date() 
    let { ActivityName, repsorduration, amount, activityDescription } = req.body;//many variables may be predetermined by activites we create
    //Input validation
    if ( !ActivityName || !repsorduration || !amount) {
        return res.status(400).json({
            status: "Failure",
            message: "One or more required parameters are missing"
        })
    }else {
     
        async function addUserActivityToDb(UserID, ActivityName, repsorduration, amount, activityDescription) {
            const connection = await sql.connect(adminconf);
            const request = connection.request();
            request.input("UserID", sql.Int, UserID)
            request.input("ActivityName", sql.VarChar, ActivityName)
            request.input("repsorduration", sql.Int, repsorduration)
            request.input("amount", sql.Int, amount)
            request.input("activityDescription", sql.VarChar, activityDescription)
            console.log(date.toLocaleDateString() +" "+ date.toLocaleTimeString("en-US",{hour12: false}))
            request.input("Date", sql.DateTime, date)

            return await request.query("INSERT INTO UserActivities(UserID, ActivityName, RepetitionsOrDuration, amount, activityDescription, DateCreated) VALUES (@UserID, @ActivityName, @repsorduration, @amount, @activityDescription, @Date)");
        }
        addUserActivityToDb(req.session.passport.user.UserID, ActivityName, repsorduration, amount, activityDescription).then(() => {
            return res.status(200).json({
                status: "success",
                message: "User activity successfully created"
            })
        }).catch((err) => {
            console.log("BUHHHHHHHHHHHHHHHHH \n \n \n" + err)
            return res.status(500).json({
                status: "failure",
                message: "Something went wrong, try again later"
            })
        }
        )
    }
}
function createTeamActivity(req, res) {
    let date = new Date()
    console.log()
    let {ActivityName, repsorduration, amount, activityDescription } = req.body;//many variables may be predetermined by activites we create
    //Input validation
    if ( !ActivityName || !repsorduration || !amount) {
        return res.status(400).json({
            status: "Failure",
            message: "One or more required parameters are missing"
        })
    }
     else {
        async function addTeamActivityToDb(TeamName, CompanyID, ActivityName, repsorduration, amount, activityDescription) {
            const connection = await sql.connect(adminconf);
            const request = connection.request();
            request.input("CompanyID", sql.Int, CompanyID)
            request.input("TeamName", sql.VarChar,TeamName)
            request.input("ActivityName", sql.VarChar, ActivityName)
            request.input("repsorduration", sql.Int, repsorduration)
            request.input("amount", sql.Int, amount)
            request.input("activityDescription", sql.VarChar, activityDescription)
            request.input("Date", sql.DateTime, date)
            return await request.query("INSERT INTO TeamActivities(TeamName,CompanyID, ActivityName, RepetitionsOrDuration, amount, activityDescription, DateCreated) VALUES (@TeamName,@CompanyID, @ActivityName, @repsorduration, @amount, @activityDescription, @Date)");
        }
        addTeamActivityToDb(req.user.TeamName,req.user.CompanyID, ActivityName, repsorduration, amount, activityDescription).then((result) => {
            console.log(JSON.stringify(result))
            return res.status(200).json({
                status: "success",
                message: "Team activity successfully created"
            })
        }).catch((err) => {
            console.log("BUHHHHHHHHHHHHHHHHH \n \n \n" + err)
            return res.status(500).json({
                status: "failure",
                message: "Something went wrong, try again later"
            }) 
        }
        )
    }
}

function createCompanyActivity(req, res) {
    let date = new Date()
    
    let {ActivityName, repsorduration, amount, activityDescription } = req.body;//many variables may be predetermined by activites we create
    //Input validation
    if ( !ActivityName || !repsorduration || !amount) {
        return res.status(400).json({
            status: "Failure",
            message: "One or more required parameters are missing"
        })
    }  else {
        async function addCompanyActivityToDb(CompanyID, ActivityName, repsorduration, amount, activityDescription) {
            const connection = await sql.connect(adminconf);
            const request = connection.request();
            console.log(CompanyID)
            request.input("CompanyID", sql.Int, CompanyID)
            request.input("ActivityName", sql.VarChar, ActivityName)
            request.input("repsorduration", sql.Int, repsorduration)
            request.input("amount", sql.Int, amount)
            request.input("activityDescription", sql.VarChar, activityDescription)
            request.input("Date", sql.DateTime, date)
            return await request.query("INSERT INTO CompanyActivities(CompanyID, ActivityName, RepetitionsOrDuration, amount, activityDescription, DateCreated) VALUES (@CompanyID, @ActivityName, @repsorduration, @amount, @activityDescription, @Date)");
        }
        console.log(req.user.CompanyID)
        addCompanyActivityToDb(req.user.CompanyID, ActivityName, repsorduration, amount, activityDescription).then(() => {
            return res.status(200).json({
                status: "success",
                message: "Company activity successfully created"
            })
        }).catch((err) => {
            console.log("BUHHHHHHHHHHHHHHHHH \n \n \n" + err)
            return res.status(500).json({
                status: "failure",
                message: "Something went wrong, try again later"
            })
        }
        )
    }
}
function removeCompanyActivity(req, res){

}
function removeTeamActvitiy(req, res){

}
function removeUserActivity(req,res){
    let time = req.body.time 
    let date = new Date(time)
    //chage date to datetime in activities
}
function deincrementAmount(req,res){
    //if amount = 0 set to completed
}
function setCompleted(req, res){

}



module.exports = {
    createUserActivity,
    createTeamActivity,
    createCompanyActivity,
    viewTopTeams,
    viewTopUsers,
    getUserActivityData,
    removeUserActivity,

}