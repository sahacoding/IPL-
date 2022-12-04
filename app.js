const express = require('express');
const app = express();
const path = require('path');
const Player = require ('./models/players')
const Team = require ('./models/team')
const mongoose = require('mongoose');
const methodOver = require('method-override');
const ejsMate = require ('ejs-mate')
const Joi = require ('joi');
const catchAsync = require ('./utils/catchAsync');
const ExpressError = require ('./utils/ExpressError');
const {isLoggedIn} = require('./middleware');

const CampsTeam = require ('./routes/camteam');
const CampsPlayer = require ('./routes/camplayer');

const session = require ('express-session');
const flash = require ('connect-flash');
const passport = require ('passport');
const LocalStrategy = require ('passport-local');
const User = require ('./models/user')

const userRoutes = require ('./routes/users')

mongoose.connect('mongodb://localhost:27017/eimageIPLS')
.then(()=>{
    console.log('Mongo Connection Open!!')
}).catch(err =>{
    console.log("Oh no Mongo Error!!")
    console.log(err)
})

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOver('_method'))

const SessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly: true,
        expires : Date.now() + 100 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(SessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes );
app.use('/teamlist', CampsTeam)
app.use('/member', CampsPlayer)


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no Something Went Wrong'
    res.status(statusCode).render('error', {err})
   })



app.listen(3071, ()=>{
    console.log('App is listening on port 3071')
})
