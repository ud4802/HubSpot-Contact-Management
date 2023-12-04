const express = require("express");
const router = express.Router();
const contact = require('../module/contact');


router.post("/", async (req, res) => {
    const { cont, user } = req.body;

    try {
        //delete contact
        await contact.deleteOne({ $and: [{ email: cont.email }, { user: user.email }] });

        res.status(200);

    } catch (err) {

        res.status(500).json({ 'message': err.message });
    }
});

module.exports = router;
