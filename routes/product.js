'use strict';
var express = require('express');
var router = express.Router();
const { product_model } = require('../model/product');
const { category_model } = require('../model/category');


/* GET product list. */
router.get('/', async function (req, res) {

    if (req.query.cat) {

        var pro = await product_model.find({ category: req.query.cat })
            .populate("category", "name");
    } else {

        var pro = await product_model.find()
            .populate("category", "name");
    }

    const cat = await category_model.find();
   
    res.render('product/index', { product: pro , cat : cat});
  
});

// GET add product
router.get('/add', async function (req, res) {
    const data = await category_model.find();
    res.render('product/add_product', { cat: data });
});

// post add product
router.post('/add', async function (req, res) {
    const data = new product_model({
        name: req.body.name,
        price: req.body.price,
        net_profit: req.body.profit,
        quantity: req.body.quantity,
        category: req.body.category
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

// GET notification page
router.get('/notification', async function (req, res) {
    const data1 = await product_model.find({ quantity: { $lt: 5,$gt : 0 } });
    const data2 = await product_model.find({ quantity: 0 });
    res.render('product/notif', { pro1: data1, pro2: data2 });
});

//GET update page
router.get('/:ID', async function (req, res) {
    if (req.params.ID === "favicon.ico") {
        return res.status(404)
    }
    const data = await product_model.findById(req.params.ID);
    const cat = await category_model.find();
  
    res.render('product/update', { product: data ,cat :cat });
});
// POST update product
router.post('/:ID', async function (req, res) {
    if (req.params.ID === "favicon.ico") {
        return res.status(404)
    }
    const find = await product_model.findByIdAndUpdate(
        req.params.ID,
        {
            name: req.body.name,
            price: req.body.price,
            net_profit: req.body.profit,
            quantity: req.body.quantity,
            category: req.body.category,
        },
        function (err, docs) {
            if (err) {

                res.send("error donkey")
            }
            else {

                res.redirect("/" + req.params.ID);
            }
        });
});
// POST delete product
router.post("/delete/:ID", async function (req, res) {
    if (req.params.ID === "favicon.ico") {
        return res.status(404)
    }
    const find = await product_model.findByIdAndRemove(
        req.params.ID,
        function (err, docs) {
            if (err) {
                res.send(err)
            }
            else {
                res.redirect("/");
            }
        });
});



// export
module.exports = router;
