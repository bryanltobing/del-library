const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const port = process.env.PORT;
const path = require('path');

// public
const publicDirectoryPath = path.join(__dirname, './public');

// db
require('./config/db/mongoose');

// routes
const index = require('./routes/index');
const user = require('./routes/user');
const cardrequest = require('./routes/cardrequest');
const book = require('./routes/book');

app.set('view engine', 'ejs');

app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded( { extended : false }));
app.use(flash());
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(function(req,res,next){
    global.session = req.isAuthenticated();
    global.errorAuth = req.flash('errorAuth');
    next();
});

// routes use
app.use('/', index);
app.use('/user', user);
app.use('/user', cardrequest);
app.use('/user', book);

app.get('*',(req, res) => {
    res.render('pages/404', {
        title : '404 not found'
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

