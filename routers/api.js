const express = require('express');
const bcrypt = require('bcryptjs');
// const e = require("express");
const fs = require("fs");
const filePath = './files/managers.json';
const authsRouter = express.Router();
const managers = [];

function writeFile(path, arr) {
    fs.writeFile(path, JSON.stringify(arr, null, 4), (err) => {
        if (err) {
            console.error('Error of writing movies file:', err);
        } else {
            console.log('File movies successfully created');
        }
    })
}
authsRouter.post('/auth/register',async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let newUser = {
            "id" : managers.length + 1,
            "email" : email,
            "password" : hashedPassword,
            "super" : req.body.super
        }
        managers.push(newUser);
        writeFile(filePath, managers);
        console.log(managers);
        res.status(201);
        res.send({'email': email, 'password': hashedPassword});
    } catch(error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})
module.exports = {
    authsRouter
}