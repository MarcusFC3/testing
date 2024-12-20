const express = require("express");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const { adminconf } = require("../models/dbusers")
const get = {
    UserInfoFromUserID : async function getNamesFromUserID(userID) {
        const connection = await sql.connect(adminconf);
        let request =  connection.request();
        request = request.input("userID", sql.Int,userID);
        return await request.query("SELECT firstName, lastName, username, TeamName, CompanyID, isTeamLeader, isCompanyLeader FROM Users WHERE UserID = @userID")
    },
    UserInfoFromEmail : async function getNamesFromUseremail(email) {
        const connectionPool = await sql.connect(adminconf);
        let request = await connectionPool.request();
        request = await request.input("email", sql.VarChar, email);
        return await request.query("SELECT UserID, firstName, lastName, username, TeamName, CompanyID, isTeamLeader, isCompanyLeader FROM Users WHERE email = @email")
    },
    UserInfoFromTeamID: async function getUsersFromTeamID(teamName, companyID) {
        const connectionPool = await sql.connect(adminconf);
        let request = connectionPool.request();
        request.input("teamName", sql.VarChar,teamName)
        request.input("companyID", sql.Int,companyID)
        return await request.query("SELECT firstName + lastName as Name, Username, isTeamLeader, isCompanyLeader FROM Users WHERE TeamID = @TeamID")
    },

    UsersFromTeam: function getUsersFromTeam(teamName) {
        get.TeamIDFromName(teamName).then((response => {
            if (!response.recordset[0]) { 
                return "teamNotFound"
            }
            else {
                let teamID = response.recordset[0].TeamID
                return getUsersFromTeamID(teamID).then(response => {//add await 
                    if (!response.recordset[0]) {
                        return "teamNotFound"
                    } else {
                        return response.recordset
                    }
                })
            }
        }))
    },

    CompanyIDFromName: async function getCompanyIDFromName(companyName) {
        const connectionPool = await sql.connect(adminconf);
        let request = await connectionPool.request();
        request = await request.input("companyName", sql.VarChar, `${companyName}`);
        return await request.query("SELECT CompanyID FROM Companies WHERE CompanyName = @companyName");
    },
    TeamsFromCompanyID: async function getTeamsFromCompanyID(CompanyID) {
        const connectionPool = await sql.connect(adminconf);
        let request = await connectionPool.request();
        request = await request.input("CompanyID", sql.Int, `${CompanyID}`);
        return await request.query("SELECT TeamName FROM Teams WHERE CompanyID = @CompanyID");
    },

    CompanyIDFromTeamID: async function getCompanyIDFromTeamID(TeamID) {
        const connectionPool = await sql.connect(adminconf);
        let request = await connectionPool.request();
        request = await request.input("TeamID", sql.Int, TeamID);
        return await request.query("SELECT CompanyID FROM Teams WHERE TeamID = 1")
    },

    TeamsFromCompany: function getTeamsFromCompany(CompanyName) {

    }
}

const check = {
    IfUserExists: async function checkIfUserExists(email) {
        const connectionPool = await sql.connect(adminconf);
        let request = connectionPool.request();
        request = request.input("email", sql.VarChar, `${email}`);
        return await request.query("SELECT email FROM Users WHERE email = @email")
    },

    IfCompanyExists: async function checkIfCompanyExists(companyName) {
        const connectionPool = await sql.connect(adminconf);
        let request = await connectionPool.request();
        request = await request.input("companyName", sql.VarChar, `${companyName}`);
        return await request.query("SELECT * FROM Companies WHERE CompanyName = @companyName")
    },
    IfTeamExists: async function checkIfTeamExists(teamName) {
        const connectionPool = await sql.connect(adminconf);
        let request =  connectionPool.request();
        request =  request.input("teamName", sql.VarChar, `${teamName}`);
        return await request.query("SELECT TeamName FROM Teams WHERE TeamName = @teamName")
    },
    ForMatchingPassword: async function checkformatch(email) {
        const connection = await sql.connect(adminconf);
        const request = connection.request()
        request.input("email", sql.VarChar, email)
        return await request.query("SELECT * FROM Users WHERE email = @email ")
        // unhash the password

    },
}
const add = {
    UserToDbCreateCompanyAndTeam: async function addUserToDbWithTeam(firstName, lastName, username, email, password, teamName, companyName) {
       
        const connection = await sql.connect(adminconf).then(() => console.log('Connected to Azure SQL Database'))
        .catch(err => console.error('Connection failed:', err));;
        console.log("asdasddddddddddddddddd")
        check.IfTeamExists(teamName).then((result) => {
            console.log(JSON.stringify(result))
            console.log(JSON.stringify(result))
            if (result.recordset[0]) {
                error = new Error({
                    status: "Failure",
                    message: "This Team Already Exists"
                })


            }
        }).catch((err)=>{console.log("asdasddddddddddddddddd")})
        //Generate salt seperatly and store it in the database along with the password
        console.log("asdasddddddddddddddddd")
        const salt = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("" + salt)
                    resolve(salt)
                }
            })
        })
        const hashedpassword = await new Promise((resolve, reject) => {

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(hash)
                }
            });

        })
        let error = undefined;
        console.log("asdasddddddddddddddddd")
        
        console.log("asdasddddddddddddddddd")
        check.IfCompanyExists(companyName).then(async (result) => {
            if (result.recordset[0]) {
                error = new Error({
                    status: "Failure",
                    message: "This Company Already Exists"
                })
            }
        }).catch(
            (err) => {
                console.log(JSON.stringify(err))
            }
        )
        if (error){
            throw error
        } else{
            console.log("asdasddddddddddddddddd")

      
/**
 * Transaction keeps executing SQL code even with error.
 */


const transaction = new sql.Transaction(connection)
console.log("DONe!")
try {
    
    await transaction.begin();
    const tRequest = transaction.request();
    
    console.log("Transaction started");
    
    // Inserting Company
    tRequest.input("companyName", sql.VarChar, companyName);
    await tRequest.query("INSERT INTO Companies (CompanyName) VALUES (@companyName)");

    let companyID;
    console.log("Company inserted");

    // Getting Company ID
    await tRequest.query("SELECT CompanyID FROM Companies WHERE CompanyName = @companyName")
        .then(result => {
            companyID = result.recordset[0]["CompanyID"];
        });

    console.log("Company ID retrieved");

    // Inserting Team
    tRequest.input("teamName", sql.VarChar, teamName);
    tRequest.input("companyID", sql.Int, companyID);
    await tRequest.query("INSERT INTO Teams (TeamName, CompanyID) VALUES (@teamName, @companyID)");

    console.log("Team inserted");

    // Inserting User
    tRequest.input("firstName", sql.VarChar, firstName);
    tRequest.input("lastName", sql.VarChar, lastName);
    tRequest.input("username", sql.VarChar, username);
    tRequest.input("email", sql.VarChar, email);
    tRequest.input("password", sql.VarChar, hashedpassword);
    await tRequest.query("INSERT INTO Users (firstName,lastName, username, email, hashedPassword, TeamName, CompanyID, isCompanyLeader, isTeamLeader) VALUES (@firstName, @lastName, @username, @email, @password, @teamName, @companyID, 1, 1)");

    console.log("User inserted");

    // Commit the transaction
    await transaction.commit();
    console.log("Transaction committed");

} catch (err) {
    console.log("Asasdad")
        console.log(err + "   asc")
        // Rollback the transaction in case of error
        await transaction.rollback()
        console.log("Transaction rolled back due to error");
    

    // Assigning error and throwing it
    error = err
    
    throw error;

} finally {
    if (error) {
        console.log("Error: ", JSON.stringify(error));
    }
}
      
          
            
        
    }


},

    userToDbAddToCompanyAndTeam: async function addUserToDbNoTeam(firstName, lastName, username, email, password, teamName, companyName) {
        const connection = await sql.connect(adminconf);
        const request = connection.request();
        let companyID;
        //Generate salt seperatly and store it in the database along with the password
        const salt = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("" + salt)
                    resolve(salt)
                }
            })
        })
        const hashedpassword = await new Promise((resolve, reject) => {

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(hash)
                }
            });
            
        })
        await get.CompanyIDFromName(companyName).then(
            (result =>{
                companyID = result.recordset[0]["CompanyID"]
            })
        )

        request.input("firstName", sql.VarChar, firstName);//put all fields in
        request.input("lastName", sql.VarChar, lastName);
        request.input("username", sql.VarChar, username);
        request.input("email", sql.VarChar, email);
        request.input("password", sql.VarChar, hashedpassword);
        request.input("teamName", sql.VarChar, teamName);
        request.input("companyID", sql.Int, companyID);

        return await request.query("INSERT INTO Users (firstName,lastName, username, email, hashedPassword, TeamName, CompanyID) VALUES (@firstName, @lastName, @username, @email, @password, @teamName, @companyID)");
    }
}
const update = {
    resetPassword : async function resetPassword(password, email){
        const salt = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("" + salt)
                    resolve(salt)
                }
            })
        })
        const hashedpassword = await new Promise((resolve, reject) => {
    
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(hash)
                }
            });
    
        })
        const connection = await sql.connect(adminconf);
        const request = connection.request();
        request.input("newpassword", sql.VarChar, hashedpassword)
        request.input("email", sql.VarChar, email)
        return await request.query("UPDATE Users SET hashedpassword = @newpassword WHERE email = @email")
    }
}

const remove = {
    
}


module.exports = {
    get,
    check,
    add,
    update
}

