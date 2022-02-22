// Function/Module Description: API's for Login and Userlog Functionality

const { Router } = require('express');
const express = require('express');
const login_router = express.Router();
const pool = require('./connectDB');

login_router.post('/api/get_userid', function (req, res) {
    
    var user = req.body._username;
    var sql_cmd = "SELECT * FROM projectdb.userinfo where user_name=$1";
    console.log(sql_cmd);

    pool.connect((err, db, done)=>{
        if (err) {
            (console.log('Error in Connecting the POOL: ' + err));
            return res.status(400).send(err);
        }
        else{
            db.query(sql_cmd,[user], (err, table) => {
                done();
                console.log("Here Users: " + table.rowCount);
                if(table.rowCount === 0){
                    console.log("Entering User: " + user);
                    db.query("INSERT INTO projectdb.userinfo(user_name, user_password, access_type) VALUES ($1,'temp','ADMIN')",[user],(data,err)=>{
                        return res.send({msg:'Passed'});
                    })
                    if (err) {
                        (console.log('Error in Connecting the POOL: ' + err));
                        return res.status(400).send(err);
                    }

                }
                else{
                    console.log('Printing the rows' + table.rowCount);
                    return res.send({msg:'Passed'});
                }
            })
        }
    })
});



login_router.post('/api/get_saved_details', function (req, res) {
    console.log('/api/get_saved_details');
    var user = req.body.user;
    var sql_cmd = "SELECT * FROM projectdb.userlog where user_name='" + user + "'";
    console.log(sql_cmd);

    pool.connect((err, db, done)=>{
        if (err) {
            (console.log('Error in Connecting the POOL: ' + err));
            return res.status(400).send(err);
        }
        else{
            db.query(sql_cmd, (err, table) => {
                done();
                if(err || table.rowCount === 0){
                    (console.log('Error in SQL query: ' + err + table.rowCount));
                    return res.status(400).send(err);
                }
                else{
                    console.log('Printing the rows' + table.rowCount)
                    table.rows.forEach(element =>{
                        console.log(element.user_name)
                    })
                    // console.log('count '+ (table.rows[0].user_name))
                    return res.send({msg:'Passed',
                                    tbl: table})
                }
            })
        }
    })
});

module.exports = login_router