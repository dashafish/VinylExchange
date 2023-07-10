//require the express module
const { response } = require('express');
const express = require( 'express');
const {body} = require('express-validator')
const controller = require ( '../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {loginLimiter} = require('../middlewares/rateLimiters');
const {validateSignup, validateLogin,validateResult, validateId} =require('../middlewares/validator')


//create routes in the module
const router = express.Router();

//GET /users/login: send html for logging in
router.get('/login',isGuest, controller.getUserLogin);

//POST /users/login: process a login request 
router.post('/login', loginLimiter, isGuest,validateLogin,validateResult, controller.login)

//GET /users/new: sign up a new user
router.get('/new', isGuest, controller.new)

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile)

//GET /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

//POST /users : create a new user
router.post('/', isGuest,validateSignup,validateResult, controller.create);



//export to use it in other files
module.exports = router;