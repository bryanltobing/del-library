const express = require('express');
const router = express.Router();
const { auth, notAuth, authRoleLibrarian } = require('../middleware/auth');
const moment = require('moment-timezone');

router.get('/add-book', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/addbook', {
        title : "Add Book",
        user : req.user
    });
});

router.post('/add-book', auth, authRoleLibrarian, (req, res) => {
    
});

module.exports = router;