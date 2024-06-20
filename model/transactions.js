const mongoose = require('mongoose');

//mongoDB schema
const transaction_schema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'products'
    },
    quantity: Number,
    profit: Number,
    type: String,
    date: {
        type: Date,
        default: Date.now()
    },



});

//mongoDB Model 

const transaction_model = mongoose.model('transaction', transaction_schema);

//exports

exports.transaction_model = transaction_model;