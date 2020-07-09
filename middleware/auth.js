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

const authAnggotaPerpustakaan = (req, res, next) => {
    if(req.user.role !== "Dosen") {
        if(req.user.statusKeanggotaan !== true) {
            req.flash('success', 'Request kartu perpustakaan terlebih dahulu');
            return res.redirect('/user/request-library-card');
        }
    }
    next();
};

module.exports = { auth, notAuth, authRoleLibrarian, authAnggotaPerpustakaan } 