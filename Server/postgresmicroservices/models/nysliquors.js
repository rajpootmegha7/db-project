
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nysSchema = new Schema({
    Brand_Label_Serial_Number:{
    type: Number,
    required: true
  },
  Brand_Label_Name:{
    type: String,
    required: true
  },
  License_Type_Code:{
      type:String,
      required: true
  },
  License_Class_Code:{
    type:String,
    required: true
},
License_Class_Description:{
    type:String,
    required: false
},
Product_Description:{
    type:String,
    required: false
},
Wholesaler_License_Serial_Number:{
    type:String,
    required: false
},
Wholesaler_Name:{
    type:String,
    required: false
}})


const nysliquors = mongoose.model('nysliquors', nysSchema);


module.exports = nysliquors