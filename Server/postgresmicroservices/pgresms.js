// Function/Module Description: API's for Postges Database post and fetch of Questions Component

const { Router } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('./connectDB');



router.get('/', (req, res)=>{
    res.send("Hello Users");
});

router.post('/validate/question_query_load', function(req,res){
    var req_data = req.body;
    var res_msg = {};
    console.log(req_data);

    if(req_data.state_name === null) return res.status(400).send({message: 'No State Selected'});

    let state_name_val = (req_data.state_name.trim()).replaceAll(" ", "")
    let where_str = "";


    var queryOpts = {};
    var sql_query = '';

    if(state_name_val.includes('and')){
        sql_query = "select PREMISE_NAME,PREMISE_ADDR,CITY_NAME,ZIP,ZONE_NAME,COUNTY,LOCATION_ID,STATE_NAME from projectdb.locationinfo where STATE_NAME ilike ANY (array[$1,$2]) ORDER BY STATE_NAME ASC"
        queryOpts = {
            text: sql_query,
            values: [state_name_val.split("and")[0], state_name_val.split("and")[1]]
        }
    }
    else if(state_name_val.includes('&')){
        sql_query = "select PREMISE_NAME,PREMISE_ADDR,CITY_NAME,ZIP,ZONE_NAME,COUNTY,LOCATION_ID,STATE_NAME from projectdb.locationinfo where STATE_NAME ilike ANY (array[$1,$2]) ORDER BY STATE_NAME ASC";
        queryOpts = {
            text: sql_query,
            values: [state_name_val.split("&")[0], state_name_val.split("&")[1]]
        }

    }
    else{
        sql_query = "select PREMISE_NAME,PREMISE_ADDR,CITY_NAME,ZIP,ZONE_NAME,COUNTY,LOCATION_ID,STATE_NAME from projectdb.locationinfo where STATE_NAME ilike $1 ORDER BY STATE_NAME ASC";
        queryOpts = {
            text: sql_query,
            values: [state_name_val]
        }
    }

    console.log(sql_query);
    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(queryOpts,(err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    console.log('Printing the rows ' + table.rows.length)

                    res.status(200).send(res_msg = {query: queryOpts,
                        tbl: table.rows});
                }
            })
        }
    })

})

router.post('/validate/getcounty_records', function(req,res){
    var req_data = req.body;
    var res_msg = {};
    console.log(req_data);

    let state_name_val = (req_data.state_name.trim()).replaceAll(" ", "")
    let where_str = "";

    var queryOpts = {};
    var temp_val = [];

    if(state_name_val.includes('and')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("and")[0], state_name_val.split("and")[1]]
    }
    else if(state_name_val.includes('&')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("&")[0], state_name_val.split("&")[1]]
    }
    else{
        where_str = "li.STATE_NAME ilike $1"
        temp_val = [state_name_val]
    }


    var sql_query = "select DISTINCT COUNTY from projectdb.locationinfo li where "+ where_str +" ORDER BY COUNTY ASC"
    queryOpts = {
        text: sql_query,
        values: temp_val
    }
    console.log(sql_query);
    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(queryOpts, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    console.log('Printing the rows ' + table.rows.length)

                    res.status(200).send(res_msg = {tbl: table.rows});
                }
            })
        }
    })

})

router.post('/validate/question_query_submit', function(req,res){
    var req_data = req.body;
    var res_msg = {};
    var sql_query = "";

    console.log(req_data);
    if(req_data.state_name === null) return res.status(400).send({message: 'No State/County Selected'});

    if(req_data.m_operation !== null){
        sql_query = "select distinct li.PREMISE_NAME,li.PREMISE_ADDR,li.CITY_NAME,li.ZIP,li.ZONE_NAME,li.STATE_NAME,oi.METHOD_OF_OPERATION from projectdb.locationinfo li inner join projectdb.operationinfo oi on li.LICENSE_SERIAL_NUMBER = oi.LICENSE_SERIAL_NUMBER ";
    }
    else{
        sql_query = "select distinct li.PREMISE_NAME,li.PREMISE_ADDR,li.CITY_NAME,li.ZIP,li.ZONE_NAME,li.STATE_NAME from projectdb.locationinfo li ";
    }

    if(req_data.issue_date !== null || req_data.recent_start_date !== null){
        sql_query += "inner join projectdb.dateinfo di on li.LICENSE_SERIAL_NUMBER = di.LICENSE_SERIAL_NUMBER " 
    }

    if(req_data.license_code !== null){
        sql_query += "inner join projectdb.licenseinfo lio on li.LICENSE_SERIAL_NUMBER = lio.LICENSE_SERIAL_NUMBER " 
    }


    let state_name_val = (req_data.state_name.trim()).replaceAll(" ", "")
    let where_str = "";

    // if(state_name_val.includes('and')) 
    // else if(state_name_val.includes('&')) 
    // else where_str = "li.STATE_NAME ilike '" + state_name_val + "'"

    var queryOpts = {};
    var temp_val = [];

    if(state_name_val.includes('and')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("and")[0], state_name_val.split("and")[1]]
    }
    else if(state_name_val.includes('&')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("&")[0], state_name_val.split("&")[1]]

    }
    else{
        where_str = "li.STATE_NAME ilike $1"
        temp_val = [state_name_val]
    }

    sql_query += "where " + where_str;
    console.log('sql_query_initi');
    console.log(sql_query); 
    
    if(req_data.county_name !== null) sql_query += " AND li.COUNTY = '" + req_data.county_name + "'";
    if(req_data.city_name !== null) sql_query += " AND li.CITY_NAME = '" + req_data.city_name + "'";
    if(req_data.zip_code !== null) sql_query += " AND li.ZIP = '" + req_data.zip_code + "'";
    if(req_data.zone_name !== null) sql_query += " AND li.ZONE_NAME = '" + req_data.zone_name + "'";
    if(req_data.m_operation !== null) sql_query += " AND oi.METHOD_OF_OPERATION = '" + req_data.m_operation + "'";
    if(req_data.issue_date !== null) sql_query += " AND di.LICENSE_ISSUED_DATE >= '" + (req_data.issue_date).split('T')[0] + "'"
    if(req_data.expiry_date !== null) sql_query += " AND di.LICENSE_EXPIRY_DATE <= '" + (req_data.expiry_date).split('T')[0] + "'"
    if(req_data.recent_start_date !== null) sql_query += " AND di.RECENT_STARTDATE_LICENSE >= '" + (req_data.recent_start_date).split('T')[0] + "'"
    if(req_data.license_code !== null) sql_query += " AND lio.LICENSE_TYPE_CODE = '" + req_data.license_code + "'";

    queryOpts = {
        text: sql_query,
        values: temp_val
    }

    console.log('sql_query');
    console.log(sql_query);


    // return res.status(200).send(res_msg);

    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(queryOpts, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    console.log('Printing the rows ' + table.rows.length)

                    res.status(200).send(res_msg = {query: queryOpts,
                        tbl: table.rows});
                    // console.log(res_msg)
                }
            })
        }
    })

})



//Get Operations for the List values 

router.post('/validate/question_query_city_name', function(req,res){
    var req_data = req.body;
    var res_msg = {};
    console.log(req_data);

    let state_name_val = (req_data.state_name.trim()).replaceAll(" ", "")
    let where_str = "";

    var queryOpts = {};
    var temp_val = [];

    if(state_name_val.includes('and')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("and")[0], state_name_val.split("and")[1]]
    }
    else if(state_name_val.includes('&')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("&")[0], state_name_val.split("&")[1]]
    }
    else{
        where_str = "li.STATE_NAME ilike $1"
        temp_val = [state_name_val]
    }

    var sql_query = "select distinct CITY_NAME from projectdb.locationinfo li where "+ where_str +"ORDER BY CITY_NAME ASC"

    queryOpts = {
        text: sql_query,
        values: temp_val
    }
    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(queryOpts, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    res.status(200).send(res_msg = {query: sql_query,
                        tbl: table.rows});
                }
            })
        }
    })

})

router.post('/validate/question_query_zip_name', function(req,res){
    var req_data = req.body;
    var res_msg = {};
    console.log(req_data);

    let state_name_val = (req_data.state_name.trim()).replaceAll(" ", "")
    let where_str = "";
    var queryOpts = {};
    var temp_val = [];

    if(state_name_val.includes('and')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("and")[0], state_name_val.split("and")[1]]
    }
    else if(state_name_val.includes('&')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("&")[0], state_name_val.split("&")[1]]
    }
    else{
        where_str = "li.STATE_NAME ilike $1"
        temp_val = [state_name_val]
    }


    var sql_query = "select distinct ZIP from projectdb.locationinfo li where "+ where_str + " ORDER BY ZIP ASC"
    queryOpts = {
        text: sql_query,
        values: temp_val
    }
    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(queryOpts, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    res.status(200).send(res_msg = {query: sql_query,
                        tbl: table.rows});
                }
            })
        }
    })

})

router.get('/get/question_query_zone_code', function(req,res){

    var sql_query = "select distinct ZONE_NAME from projectdb.locationinfo"
    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(sql_query, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    res.status(200).send(res_msg = {query: sql_query,
                        tbl: table.rows});
                }
            })
        }
    })

})


router.post('/validate/question_query_method_operation', function(req,res){
    var req_data = req.body;
    var res_msg = {}
    console.log(req_data)


    let state_name_val = (req_data.state_name.trim()).replaceAll(" ", "")
    let where_str = "";

    var queryOpts = {};
    var temp_val = [];

    if(state_name_val.includes('and')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("and")[0], state_name_val.split("and")[1]]
    }
    else if(state_name_val.includes('&')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("&")[0], state_name_val.split("&")[1]]
    }
    else{
        where_str = "li.STATE_NAME ilike $1"
        temp_val = [state_name_val]
    }

    var sql_query = "select distinct oi.METHOD_OF_OPERATION from projectdb.locationinfo li inner join projectdb.operationinfo oi on li.LICENSE_SERIAL_NUMBER = oi.LICENSE_SERIAL_NUMBER where " + where_str + " ORDER BY oi.METHOD_OF_OPERATION";


    queryOpts = {
        text: sql_query,
        values: temp_val
    }

    console.log('Query: ' + sql_query)
    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(queryOpts, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    res.status(200).send(res_msg = {query: sql_query,
                        tbl: table.rows});
                }
            })
        }
    })

})



router.post('/validate/question_query_license_code', function(req,res){
    var req_data = req.body;
    var res_msg = {}
    console.log('Req: ' + req_data)

    let state_name_val = (req_data.state_name.trim()).replaceAll(" ", "")
    let where_str = "";
    
    var queryOpts = {};
    var temp_val = [];

    if(state_name_val.includes('and')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("and")[0], state_name_val.split("and")[1]]
    }
    else if(state_name_val.includes('&')){
        where_str = "li.STATE_NAME ilike ANY (array[$1,$2])"
        temp_val = [state_name_val.split("&")[0], state_name_val.split("&")[1]]
    }
    else{
        where_str = "li.STATE_NAME ilike $1"
        temp_val = [state_name_val]
    }
    var sql_query = "select distinct lio.LICENSE_TYPE_CODE from projectdb.locationinfo li inner join projectdb.licenseinfo lio on li.LICENSE_SERIAL_NUMBER = lio.LICENSE_SERIAL_NUMBER where " + where_str + " ORDER BY lio.LICENSE_TYPE_CODE ASC"
    console.log('Query: ' + sql_query);

    queryOpts = {
        text: sql_query,
        values: temp_val
    }


    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(queryOpts, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    res.status(200).send(res_msg = {query: sql_query,
                        tbl: table.rows});
                }
            })
        }
    })

})

//User preferences

router.post('/validate/saved_preferences', function(req,res){
    var req_data = req.body;
    var res_msg = {}
    
    console.log('/validate/saved_preferences')
    console.log(req_data);
    var query_tm = req_data.sql_query.text

    if(req_data.sql_query.values.length == 2){
        query_tm = query_tm.replaceAll("$1", "'"+req_data.sql_query.values[0]+"'");
        query_tm = query_tm.replaceAll("$2", "'"+req_data.sql_query.values[1]+"'");
    }
    else{
        query_tm = query_tm.replaceAll("$1", "'"+req_data.sql_query.values[0]+"'")
    }



    var slct = query_tm.split('from')[0].replace('select ','');

    var joins = (query_tm.split('from')[1]).split('where')[0]

    var whr = (query_tm.split('from')[1]).split('where')[1].replaceAll("'", '"');

    console.log('Reqesting: ' + slct + " ---> " + joins + " ---> " + whr)


    var query = "INSERT INTO projectdb.userlog(user_name, search_history, log_info, other) VALUES";


    var op_str = "('"+ req_data.user + "','" + slct + "','"+ joins + "','"+ whr + "')";
    query += op_str;

    console.log('Query: ' + query)
    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(query, (err) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    res.status(200).send({message: "Successfully Posted the Data"});
                }
            })
        }
    })

})


router.post('/validate/reference_query_result', function(req,res){
    var req_data = req.body;
    var res_msg = {};
    console.log(req_data);

    var sql_query = req_data.query;

    if(sql_query === null || sql_query === undefined) res.status(400).send(err);

    pool.connect((err,db,done)=>{
        if(err){
            console.log('Error in Connecting the POOL: ' + err);
            return res.status(400).send(err);
        }
        else{
            db.query(sql_query, (err, table) => {
                done();
                if(err){
                    (console.log('Error in SQL query: ' + err));
                    return res.status(400).send(err);
                }
                else{
                    (console.log(table.rows));
                    res.status(200).send(res_msg = {tbl: table.rows});
                }
            })
        }
    })

})

module.exports = router;
