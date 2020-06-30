const express = require('express');
const router = express.Router();

// models
const Pengumuman = require('../models/pengumuman');

router.get('/pengumuman-list', async (req, res) => {
    try {
        const pengumuman = await Pengumuman.find({});
        res.send(pengumuman);
    } catch(e) {
        console.log("error " + e);
    }
});


module.exports = router;