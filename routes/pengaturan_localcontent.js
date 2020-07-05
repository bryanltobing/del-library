const express = require('express');
const router = express.Router();

const LocalContent = require('../models/local_content');

router.get('/localcontent', async(req, res) => {
    try {
        const localcontent = await LocalContent.find({});
        res.send(localcontent);
    } catch(e) {
        res.status(400).send(e);
    }
}); 

module.exports = router;