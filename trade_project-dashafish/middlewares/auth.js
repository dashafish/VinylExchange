const Item = require('../models/item')
// if user is a guest - continue, otherwise redirect to users/profile
exports.isGuest = (req,res,next)=>{
    if(!req.session.user){
        return next()
    }     
   else{
        req.flash('error', "You are logged in already");
        return res.redirect('/users/profile')
   }
}

//if user is an authenticated user - continue, o.w. redirect
exports.isLoggedIn = (req,res,next)=>{
    if(req.session.user){
        return next();
    }     
   else{
        req.flash('error', "You need to log in first");
        return res.redirect('/users/login')
   }
};

//if user is author of the trade - continue
exports.isAuthor = (req,res,next)=>{
    let id = req.params.id;
    Item.findById(id)
    .then(item=>{
        if(item){
            if(item.owner == req.session.user){
                return next()
            }else{
                let err = new Error ('Unathorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err=>next(err))
};