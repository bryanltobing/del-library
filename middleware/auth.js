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

const authRoleLibrarian = (req, res, next) => {
    if(req.user.role !== "Librarian") {
        return res.render('pages/403', {
            title : '403 not authorized'
        });
    }
    next();
}

module.exports = { auth, notAuth, authRoleLibrarian } 