const express = require("express");
const router = express.Router();
const data = require("../data");
const contactData = data.contacts;

router.get("/", (req, res) => {
    contactData.getAllContacts().then((contactList) => {
        res.json(contactList);
    })
    .catch(() => {
        res.sendStatus(500);
    });
});

router.post("/", (req, res) => {
    let newContact = req.body.comment;

    contactData.addContact(newContact).then((contact) => {
        res.json(contact);
    })
    .catch(() => {
        res.sendStatus(500);
    });
});

module.exports = router;