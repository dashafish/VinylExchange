const User = require('../models/user');
const Item = require('../models/item');
const watchModel = require('../models/watch');
const offerModel = require('../models/offer');


exports.getUserLogin = (req,res,next)=>{
      return res.render('./user/login') 
};

exports.login = (req,res,next)=>{
   let email=req.body.email;
   if(email)
      email = email.toLowerCase();
   let password = req.body.password; 
   //get the user that matches the email
   User.findOne({email: email})
   .then(user =>{
      if(user){
         //user is found in the database
         user.comparePassword(password)
         .then(result=>{
            if(result){
               req.session.user = user._id; //store user's id in the session
               req.flash('success', "Yay, you have successfully logged in!")
               res.redirect('/users/profile');
            }else{
               req.flash('error', "Oops! Wrong password.")
               res.redirect('/users/login');
            }
         })
      }else{
         console.log('wrong email address');
         req.flash('error', "Oh uh! Wrong email address.")
         res.redirect('/users/login');
      }
   })
   .catch(err=>next(err));
};

exports.new = (req,res)=>{
   return res.render('./user/new')
};



exports.create = (req, res, next) => {
     let user = new User(req.body);
     if(user.email)
      user.email = user.email.toLowerCase();
     user.save()
       .then(() => res.redirect('/users/login'))
       .catch(err => {
         if (err.name === "ValidationError") {
           req.flash('error', err.message);
           return res.redirect('/users/new');
         }
         if (err.code === 11000) {
           req.flash('error', "Email has been used");
           return res.redirect('/users/new');
         }
         next(err);
       });
 };
 

exports.profile= (req,res,next)=>{
 let id = req.session.user;
  Promise.all([User.findById(id), Item.find({owner: id}),
               watchModel.find({user: id}).populate('watchItem'), 
               offerModel.find({$or:[{sender: id}, 
               {receiver: id}]}).populate('wantedItem ownedItem')])
   .then(results=>{
      const [user, items, watches, offers] = results;
      let sentOffers = []; //stores offers sent by the user
      let receivedOffers = []; //stores offers received by the user
      offers.forEach((offer) =>{
            if(offer.sender == id){
               sentOffers.push(offer);
            }
            if(offer.receiver == id){
               receivedOffers.push(offer);
            }
         
      });
     res.render('./user/profile', {user, items, watches,
       sentOffers,receivedOffers});
   })
   .catch(err=>next(err)) 
};

exports.logout = (req,res,next)=>{
   req.session.destroy(err =>{
      if(err)
          return next(err);
      else
          res.redirect('/users/login');
   });
};

