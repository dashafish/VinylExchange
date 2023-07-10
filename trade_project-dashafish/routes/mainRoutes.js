//require the express module
const { response } = require('express');
const express = require( 'express');
const controller = require ( '../controllers/mainController');

//create routes in the module
const router = express.Router();

//index page
router.get('/',controller.index);
//about page
router.get('/about', controller.about);
//contact
router.get('/contact', controller.contact);

module.exports = router;