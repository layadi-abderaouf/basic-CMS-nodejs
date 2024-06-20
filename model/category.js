const mongoose = require('mongoose');

//mongoDB schema
const cat_schema = new mongoose.Schema({
    
    name: String,
});

//mongoDB Model 

const category_model = mongoose.model('category', cat_schema);

//exports

exports.category_model = category_model;