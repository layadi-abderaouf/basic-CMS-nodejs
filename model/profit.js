const mongoose = require('mongoose');

//mongoDB schema
const profit_schema = new mongoose.Schema({

    name: String,
    before: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profit'
    },
    profit: Number,
    income: Number,
    change: Number,
    status: Number



});

//mongoDB Model 

const profit_model = mongoose.model('profit', profit_schema);

//exports

exports.profit_model = profit_model;