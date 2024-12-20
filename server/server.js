"use strict"

const express = require("express");
const https = require("https");
const app = require("./api/index");
const sql = require("mssql");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;;
export default app;
// const server = https.createServer({
//     key: fs.readFileSync(path.join(__dirname, ".." , "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname,  ".." , "cert.pem")),
// }, app); 

// server.listen(PORT, () => {
//     console.log("Server is listening on port " + PORT);
// })  