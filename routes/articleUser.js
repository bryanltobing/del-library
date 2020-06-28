const express = require('express');

const router = express.Router();

router.get('/add-article', (req, res) => {
    res.render('pages/addarticle', {
        title : "Add Article"
    });
});

router.post('/article', (req, res) => {

});

module.exports = router;