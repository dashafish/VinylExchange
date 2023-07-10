const {validationResult} = require('express-validator');
const {body} = require('express-validator');
exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error("Invalid story id");
        err.status = 400;
        return next(err);
    }else{
        return next();
    }
};

exports.validateSignup =
[body('firstName','first name cannot be empty').notEmpty().trim().escape(),
 body('lastName','last name cannot be empty').notEmpty().trim().escape(),
 body('email', "Email must be a valid email address").isEmail().trim().escape().normalizeEmail(),
 body('password', "Password must be between 8 to 64 characters").isLength({min: 8, max:64})
];

exports.validateLogin=
[body('email', "Email must be a valid email address").isEmail().trim().escape().normalizeEmail(),
body('password', "Password must be between 8 to 64 characters").isLength({min: 8, max:64})];

exports.validateResult =(req,res,next)=>{
    let errors = validationResult(req);
   if(!errors.isEmpty()){
      errors.array().forEach(error=>{
         req.flash('error', error.msg);
      });
      return res.redirect('back');
   }else{
        return next();
   }
}