const express = require("express");
const router = express.Router();
const contact = require('../module/contact');


router.post("/", async (req, res) => {

    const { oldemail, fInput, lInput, eInput, pInput, user } = req.body;

    try {
        //delete contact
        await contact.deleteOne({ $and: [{ user: user.email }, { email: oldemail }] });

        //create new contact 
        const result = await contact.create({
            "firstName": fInput,
            "lastName": lInput,
            "phone": pInput,
            "email": eInput,
            "user": user.email
        });
        res.status(200);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
});

module.exports = router;
