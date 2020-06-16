const auth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    req.flash('errorAuth', 'You need to login before accessing this page');
    res.redirect('/user/login');
}

const notAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();   
}

module.exports = { auth, notAuth } 