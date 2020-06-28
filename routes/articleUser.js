const express = require('express');

const router = express.Router();

// middleware
const { auth, authRoleLibrarian } = require('../middleware/auth');

router.get('/add-article', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/addarticle', {
        title : "Add Article",
        user : req.user
    });
});

router.post('/article', (req, res) => {

});

module.exports = router;