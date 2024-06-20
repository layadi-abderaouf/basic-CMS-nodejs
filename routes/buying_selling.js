'use strict';
var express = require('express');
var router = express.Router();
const { product_model } = require('../model/product');
const { transaction_model } = require('../model/transactions');
const { category_model } = require('../model/category');
const { profit_model } = require('../model/profit');

/* GET buy page */
router.get('/buy',async function (req, res) {
    const data = await product_model.find();
    res.render('buysell/buy', { product: data });
    
});

//POST buy page
router.post('/buy', async function (req, res) {
    const product = await product_model.findById(req.body.pro);

    const data = new transaction_model({
        product: req.body.pro,
        quantity: req.body.quantity,
        profit: 0,
        type: "buy"
    });

    await data.save();
    let q = parseInt(product.quantity) + parseInt( req.body.quantity);
    
    const find = await product_model.findByIdAndUpdate(
        req.body.pro,
        {
            quantity: q,
        }
     )
     res.redirect('/buysell/buy');
    
    
});

// GET sell page
router.get('/', async function (req, res) {

    if (req.query.cat) {

        var data = await product_model.find({ category: req.query.cat })
            .populate("category","name");
    } else {
        
        var data = await product_model.find()
            .populate("category", "name");
    }

    const cat = await category_model.find();
    
    res.render('buysell/sell', { product: data, cat: cat });

});

//POST sell page
router.post('/', async function (req, res) {
    const period = await profit_model.find({ status: 1 });
    const product = await product_model.findById(req.body.pro);
    if (product.quantity > 0) {
        const data =  new transaction_model({
        product: req.body.pro,
        quantity: req.body.quantity,
        profit: req.body.quantity * product.net_profit,
        type: "sell"
        });

   
        await data.save();


        for (let i = 0; i < period.length; i++) {
            period[i].profit += req.body.quantity * product.net_profit;
            await period[i].save();
        }
        let q = parseInt(product.quantity) - parseInt(req.body.quantity);
        const find = await product_model.findByIdAndUpdate(
        req.body.pro,
        {
            quantity: q,
        }
    )
        res.redirect('/buysell/')

    } else {
        res.send("product finished ")

    }
    
    
});


//export
module.exports = router;