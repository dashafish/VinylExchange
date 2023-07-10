// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const storyRoutes = require('./routes/storyRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// create app
const app = express();

//configure app
let port = 3000;
let host='localhost';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect('mongodb://localhost:27017/project',
                {useNewUrlParser: true,
                useUnifiedTopology: true, 
                 useCreateIndex:true})
.then(()=>{
    app.listen(port,host,()=>{
        console.log('Server is running on port', port)
    })
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'duh2d4824hduwhdies',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*10000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/project'})
}));

app.use(flash());

app.use((req,res,next)=>{
    res.locals.user= req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})


//set up routes 
app.use('/',mainRoutes);
app.use('/trades', storyRoutes);
app.use('/users', userRoutes);

app.use((req,res,next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});
app.use((err, req, res,next)=>{
    if(!err.status){
        console.log(err);
        err.status = 500;
        err.message = ('Internal server error');
    }
    res.status(err.status);
    res.render('error', {error: err});

});


