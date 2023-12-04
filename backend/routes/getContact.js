const express = require("express");
const router = express.Router();
const contact = require('../module/contact');
var url = require('url');


router.get("/", async (req, res) => {

    //parse url
    var q = url.parse(req.url, true);
    var qdata = q.query;

    try {
        //find contacts of user
        const users = await contact.find({ user: qdata.user });
        res.json(users);

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
});

module.exports = router;
