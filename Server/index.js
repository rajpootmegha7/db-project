
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = 4000;               // LOCAL PORT DEFINATIONS where the backend will be hosted..............

const app = express();

const database = require('./postgresmicroservices/connectDB');
const mongodb = require('./postgresmicroservices/connectMongo');
const login = require('./postgresmicroservices/login.js');
const pgresms = require('./postgresmicroservices/pgresms.js');
const mgservices = require('./postgresmicroservices/mgservices.js')




app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(cors());


app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


;(async function(){
    const client = await database.connect();
    mongodb();
    console.log("Printing Client Connect: " + client);
    app.locals.dbclient = client;
    app.listen(PORT);
    console.log('Listening to the PORT: '+ PORT);
})()

//Internal Endpoint defination modules
 
app.use('/login', login); //Login services
app.use('/pgresms', pgresms); //Postgres Services
app.use('/mgservices', mgservices); //Atlas services


