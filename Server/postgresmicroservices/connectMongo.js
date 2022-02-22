// Function/Module Description: Connection to Mongo Atalas with URI

const mongoose = require('mongoose');

const uri = 'mongodb+srv://mongoadmin:admin1234@melodycluster.cgcsn.mongodb.net/WineDB'

const connectDB = async() => {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(result => {console.log('Connected to DB');})
        .catch((err)=>{console.log(err)});
    
}
module.exports = connectDB;
