const { MongoUnexpectedServerResponseError } = require('mongodb');
const model = require('../models/item');
const watchModel = require('../models/watch');
const offerModel = require('../models/offer');

exports.index=(req, res)=>{
    //res.send(model.find());
    model.find()
    .then(items=> res.render('./item/index',{items}))
    .catch(err=> next(err));
};

exports.new=(req,res)=>{
    res.render('./item/new');
};

exports.create=(req,res,next)=>{
   // res.send( 'created a new trade');
   let item = new model(req.body); //create a new item doc
   item.owner = req.session.user;
   item.image = '/images/default.jpeg';
   item.save() //insert new item 
   .then((item)=> {
    req.flash('success', 'You have created a new listing!');
    res.redirect('/trades')
   })
   .catch(err=>{
        if(err.name === "ValidationError"){
            err.status= 400;
        }
        next(err);
   });
};

 exports.edit =(req,res,next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(item=>{
        if(item){
           return res.render('./item/edit',{item});
        }else{
            let err = new Error ('Cannot find a trade with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};


exports.update = (req,res,next)=>{
   let item = req.body;
   let id = req.params.id;
    model.findByIdAndUpdate(id, item,{useFindAndModify:false, runValidators:true})
    .then(item=>{
        if(item){
            req.flash('success', "You have successfuly updated this listing!");
            res.redirect('/trades/'+id);
        }else{
            let err = new Error ('Cannot find a trade with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === "ValidationError")
        err.status = 400;
        next(err)
    })
};

exports.delete= (req,res,next)=>{
    let id = req.params.id;
    model.findByIdAndDelete(id,{useFindAndModify:false})
    .then(item =>{
        if(item){
            req.flash('success', "You have successfuly deleted this listing!");
            res.redirect('/trades');
        }else{
            let err = new Error ('Cannot find a trade with id ' + id);
             err.status = 404;
             next(err);
        }
    })
    .catch(err=>next(err));     
};

exports.about = (req,res)=>{
    res.render('./views/about');
};
exports.contact = (req,res)=>{
    res.render('./views/contact');
};

//add to the watchlist
exports.watch = (req,res,next) =>{
    let watch = new watchModel(req.body); //create a new watch document
    watch.user = req.session.user;
    watch.watchItem = req.params.id;
    watch.save() //insert the document in the database
    .then((watch)=> {
        req.flash('success', 'You have added an item to the watchlist!');
        res.redirect('/users/profile')
       })
       .catch(err=>{
            if(err.name === "ValidationError"){
                err.status= 400;
            }
            next(err);
       });
    };
  
    exports.show = (req, res, next) => {
        let id = req.params.id;
        let userId = req.session.user;
        //execute 2 async 
        Promise.all([ model.findById(id).populate('owner', 'firstName lastName'),
        watchModel.find({watchItem: id, user: userId}).populate('user')])
        .then(results => {
            if(results){
                const [item, watch] = results;
               return res.render('./item/trade', {item, watch}); //render a trade.ejs
            } else {
                let err = new Error("Cannot find a product with id " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
    };
    

//remove from the watchlist
exports.deleteWatch = (req,res,next) =>{
    let id = req.params.id;
    watchModel.findOneAndDelete({watchItem: id, user: req.session.user}, {useFindAndModify:false})
    .then(watch =>{
        if(watch){
            req.flash('success', "You have deleted an item from your watch list");
            res.redirect('/users/profile');
        }
        else{
            let err= new Error("Unable to find an item with id " + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};


exports.request = (req, res, next) =>{
    let userId = req.session.user;
    let id = req.params.id;
    model.find({$or: [{_id: id}, {owner: userId}]}) //find by id userid
    .then(items=>{
        let wantedItem = [];
        let ownedItem = [];
        items.forEach((item) => {
            if (item.id == id) {
                wantedItem = item;
            }
            else {
                if (item.status == 'available') {
                    ownedItem.push(item);
                }
            }
        });
        res.render("./item/request", {wantedItem, ownedItem});
    })
    .catch(err=>next(err));
};

// process and add the new offer to the database 
exports.makeOffer = (req, res, next) =>{
    let offer = new offerModel(req.body);// create a new offer document 
    offer.sender = req.session.user;
    offer.wantedItem = req.params.id;
    offer.status = "pending"; //set to pending to indicate that offer is awaiting a response
    offer.save() // insert the document in the database
    .then(offer =>{
        if(offer){
            req.flash('success', "You have sent a new offer!");
            res.redirect('/users/profile');
        }else{
            let err = new Error ('Cannot find a trade with id ' + id);
            err.status = 404;
            return next(err);
       }
    })
    .catch(err => next(err));
};

//cancel the offer for a trade
exports.cancelTrade = (req, res,next) =>{
    let id = req.params.id;
    offerModel.findByIdAndDelete(id,{useFindAndModify:false})
    .then(offer =>{
        if(offer){
            req.flash('success', "You have successfuly deleted the offer!");
            res.redirect('/users/profile');
        }else{
            let err = new Error ('Cannot find a trade with id ' + id);
             err.status = 404;
             next(err);
        }
    })
    .catch(err=>next(err));   
};
exports.acceptOffer = (req, res, next) =>{
    let id = req.body.offerID;
    let update = {offerID: id, status: "Traded"}
    offerModel.findByIdAndUpdate(id, update, {useFindAndModify: false, runValidators: true})
    .then(update =>{
        if (update) {
            let itemId = update.item;
            offerModel.findByIdAndDelete(id)
                .then(() =>{
                    req.flash('success', "You have successfully accepted the offer!")
                    res.redirect("/users/profile");
                })
                .catch( err => next(err));
        } 
        else {
            let err = new Error("Cannot find a product with id " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};






