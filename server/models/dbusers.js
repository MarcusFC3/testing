"use strict"
const {HttpProxyAgent} = require("http-proxy-agent")

const agent = new HttpProxyAgent("http://fixie:mM4D7MBMmG6r9p4@criterium.usefixie.com:80")


const servadminconf = {
    server: "healthyhabittracker.database.windows.net",
        user: "serveradmin",
        password: "HmCBVzQ5w~fY5hL",//Do NOT hard code this value
        database: "SimplyHealth",

        options: { 
            encrypt: true, 
            trustServerCertificate: true,
            port: 1433,
        }
}

// const servadminconf = {
//     server: "10.44.142.88\\SQLEXPRESSBPA",
//         user: "serveradministrator",
//         password: "admin",
//         database: "SimplyHealth",
 
//         options: { 
//             encrypt: true, 
//             trustServerCertificate: true
//         }
// }



module.exports = {
    adminconf : servadminconf,
};