const mongoose = require('mongoose');

//mongoDB schema
const product_schema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    net_profit: Number,
    quantity: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
    

});

//mongoDB Model 

const product_model = mongoose.model('products', product_schema);

//exports

exports.product_model = product_model;