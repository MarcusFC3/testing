"use strict"

// const servadminconf = {
//     server: "healthyhabittracker.database.windows.net",
//         user: "serveradmin",
//         password: "HmCBVzQ5w~fY5hL",//Do NOT hard code this value
//         database: "SimplyHealth",

//         options: { 
//             encrypt: true, 
//             trustServerCertificate: true
//         }
// }

const servadminconf = {
    server: "10.44.142.88\\SQLEXPRESSBPA",
        user: "serveradministrator",
        password: "admin",
        database: "SimplyHealth",
 
        options: { 
            encrypt: true, 
            trustServerCertificate: true
        }
}



module.exports = {
    adminconf : servadminconf,
};