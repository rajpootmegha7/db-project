// Function/Module Description: API's for Mongo Database post and fetch

const express = require('express');
const nysSchema = require('./models/nysliquors.js')

const router = express.Router();

router.post('/api/mg/getWineList',async(req,res)=>{
    var request_id = req.body.id;
    console.log(('/api/mg/getWineList'));
    console.log(request_id);

    const unique_list = [];

    request_id.forEach(value => {
    if (unique_list.indexOf(value) === -1) {
        unique_list.push(value);
    }
    });

    var wineList = [];
    var temp = {};


    nysSchema.find({Wholesaler_Name:unique_list})
        .then(data=>{
            console.log(data)
            
            res.status(200).send(data);

        })
        .catch(err=>{
            console.log(err)
        })
    
    
  });
  

  module.exports = router;