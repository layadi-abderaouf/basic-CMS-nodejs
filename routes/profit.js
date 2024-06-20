'use strict';
var express = require('express');
var router = express.Router();
const { product_model } = require('../model/product');
const { transaction_model } = require('../model/transactions');
const { category_model } = require('../model/category');
const { profit_model } = require('../model/profit');

/* GET statistique page. */
router.get('/', async function (req, res) {

    const profit = await profit_model.find().populate("before", "name profit");
    console.log(profit);
    const tran = await transaction_model.find({type : "sell"});
    var obj = {
        day: 0,
        week: 0,
        month: 0,
        all: 0
    };
    for (let i = 0; i < tran.length; i++) {

        var now = new Date().getTime();
        var tran_date = new Date(tran[i].date);
        var distance = now - tran_date;


        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var week = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
        var month = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));

        obj.all += tran[i].profit;
        if (month == 0) {
            obj.month += tran[i].profit;
            if (week == 0) {
                obj.week += tran[i].profit;
                if (days == 0) {
                    obj.day += tran[i].profit;
                }
            }
        }
        
    }

    res.render('profit/index', { profit: profit, pro: obj });
});

// post add period 
router.post('/', async function (req, res) {
    const data = new profit_model({
        name: req.body.name,
        before: req.body.before,
        profit: 0,
        income: 0,
        change: 0,
        status: 0
    });

    try {
        await data.save();
        res.redirect('/')
    }
    catch (err) {
        res.send("error , The data has not been added");
        res.send(err);
    }
});

//post update period
router.post('/update_period', async function (req, res) {
    const find = await profit_model.findByIdAndUpdate(
        req.body.id,
        {
            status: req.body.status,
            before: req.body.before
        },
        function (err, docs) {
            if (err) {

                res.send("error donkey")
            }
            else {

                res.redirect("/profit" );
            }
        });
});

//post add category
router.post('/add_cat', async function (req, res) {
    const data = new category_model({
        name: req.body.cat,
    });

    try {
        await data.save();
        res.redirect('/')
    }
    catch (err) {
        res.send("error , The data has not been added");
        res.send(err);
    }
});

/* GET transaction page. */
router.get('/transaction', async function (req, res) {
    const data = await transaction_model.find()
        .populate("product", "name")
        .sort({date : -1});
    res.render('profit/transaction', { tran: data });
});

// GET product profit
router.get('/product', async function (req, res) {
    if (req.query.cat) {
        var product = await product_model.find({ category: req.query.cat });
    } else {
        var product = await product_model.find();
    }
    
    const cat = await category_model.find();
    const tran = await transaction_model.find().populate("product","name");
    var data = [];
   
    for (let i = 0; i < product.length; i++) {
        
        var obj = {
            name: product[i].name,
            day_profit: 0,
            week_profit: 0,
            month_profit: 0,
            total_profit : 0
        };
       

        for (let j = 0; j < tran.length; j++) {
           
            var now = new Date().getTime();
            var tran_date = new Date(tran[j].date);
            var distance = now - tran_date ;

           
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var week = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
            var month = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));

            if (tran[j].product.name == product[i].name && tran[j].type == "sell") {
                if (month == 0) {
                    obj.month_profit += tran[j].profit;
                    if (week == 0) {
                        obj.week_profit += tran[j].profit;
                        if (days == 0) {
                            obj.day_profit += tran[j].profit;
                        }
                    }
                }
                obj.total_profit += tran[j].profit;  
            };
        };
        data.push(obj);
        
    }

    res.render('profit/product_profit', { product: data, cat: cat });
});

//export
module.exports = router;