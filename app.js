const express = require('express');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const PORT = process.env.PORT || 5000;

//DB config
const db = require('./config/key').MongoURI;

//passport config
require('./config/passport')(passport);

//connect
mongoose.connect(db, { useNewUrlParser: true,useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//EJS
app.use(express.static(path.join(__dirname, '/public')));
app.use(expressLayout);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended : false}));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

app.use('/', indexRouter);
app.use('/users', userRouter);
app.listen(PORT, () => {
    console.log(`Serve started at ${PORT}`);
})

