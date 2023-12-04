const express = require("express");
const router = express.Router();
const contact = require('../module/contact');


router.post("/", async (req, res) => {
    const { firstName, lastName, email, phone, user } = req.body;

    //check all filed are not empty
    if (!firstName || !email || !phone || !lastName) return res.status(400).json({ 'message': 'name and email are required.' });

    //find duplicate and send error
    const duplicate = await contact.findOne({ $and: [{ email: email }, { user: user.email }] }).exec();
    if (duplicate) return res.sendStatus(409);

    try {

        //create and store the new user
        const result = await contact.create({
            "firstName": firstName,
            "lastName": lastName,
            "phone": phone,
            "email": email,
            "user": user.email
        });

        res.status(201).json({ 'success': `New contact created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
});

module.exports = router;
