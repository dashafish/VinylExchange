const model = require('../models/item');

exports.index = (req, res) => {
    res.render('../views/index');
};

exports.about = (req, res) =>{
    res.render('../views/about');
};

exports.contact = (req, res) =>{
    res.render('../views/contact');
};