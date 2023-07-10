const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 60*1000, //1 minute time window
    max: 3,
   // message: 'Too many invalid login requests. Try again later.'
   handler:(req, res,next)=>{
        let err = new Error('Uh oh, too many invalid login requests. Try again later.');
        err.status = 429;
        return next(err);
   }
});