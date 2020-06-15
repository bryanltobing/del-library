const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/index' , {
        title : "OLIS ITDEL",
    });
});

router.get('/services', function(req, res) {
    res.render('pages/services' , {
        title : "Services - OLIS ITDEL",
        session : req.session.passport
    });
});


module.exports = router;