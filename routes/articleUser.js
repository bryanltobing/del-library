const express = require('express');

const router = express.Router();

router.get('/article', (req, res) => {
    res.render('pages/article', {
        title : "Article"
    });
});

module.exports = router;