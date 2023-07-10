//require the express module
const { response } = require('express');
const express = require( 'express');
const controller = require ( '../controllers/storyController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const{validateId} = require('../middlewares/validator');
//create routes in the module
const router = express.Router();

//create routes 
//GET /trades : send all trades 
router.get('/', controller.index);

//GET /trades/newTrade : making a new trade
router.get('/new', isLoggedIn, controller.new);

//POST /trades: create a new trade
router.post('/', isLoggedIn, controller.create);

/*GET /trades/:id: send details of a trades 
identified by id*/
router.get('/:id',validateId, controller.show);

//GET /trades/:id/edit : send html form for editing existing trade 
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

//PUT /trades/:id : update the story identified by id
router.put('/:id', validateId, isLoggedIn, isAuthor,controller.update);

//DELETE /trades/:id : delete the story identified by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

//POST /trades/watch : add to watch
router.post('/:id/watch',validateId, isLoggedIn,controller.watch);

//DELETE /trades/watch/:id : delete from watch
router.delete('/:id/watch', validateId,isLoggedIn, controller.deleteWatch);

//POST /trades/:id/request : request a new trade 
router.post('/:id/request',validateId, isLoggedIn, controller.request);

//POST /trades/:id/makeOffer : make a new offer
router.post('/:id/makeOffer', isLoggedIn,controller.makeOffer);

//DELETE /trades/offer/cancel : withdraw/cancel/reject a trade
router.delete('/offer/:id', isLoggedIn, controller.cancelTrade);

//accept the offer
router.put('/offer/accept', isLoggedIn, controller.acceptOffer);


module.exports = router;