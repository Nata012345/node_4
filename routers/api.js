const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const e = require("express");
const fs = require("fs");
const filePath = './files/managers.json';
const authsRouter = express.Router();
let managers = [];
const SALT = 10 //bcrypt.genSalt(10);

managers = fs.readFileSync('./files/managers.json', {encoding : 'utf8'});
managers = JSON.parse(managers);
function writeFile(path, arr) {
    fs.writeFile(path, JSON.stringify(arr, null, 4), (err) => {
        if (err) {
            console.error('Error of writing movies file:', err);
        } else {
            console.log('File movies successfully created');
        }
    })
}
async function generateHush(password) {
    let hash = await bcrypt.hash(password, SALT);
    return hash;
}

authsRouter.post('/auth/register',async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // const salt = await bcrypt.genSalt(10);
        console.log("1")
        let hashedPassword = await generateHush(password);
        console.log("4")
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

authsRouter.post('/auth/login', async (req, res) => {
    try {
        const email = req.body.email;
        // console.log(typeof email);
        // managers = fs.readFileSync('./files/managers.json', {encoding : 'utf8'});
        // console.log(managers);
        // console.log(Array.isArray(managers));
        let userByMail = managers.find(item => item.email === email);
        // console.log(userByMail);
        if (userByMail) {
            if (userByMail.super) {
                const password = req.body.password;
                // let hashedPassword = await generateHush(password);
                // console.log(hashedPassword);
                // console.log(userByMail.password);
                const compareHush = await bcrypt.compare(password, userByMail.password);
                if (compareHush) {
                    const token = jwt.sign({ id: userByMail.id, email: userByMail.email },
                        "secret_key", { expiresIn: '5m' });
                    return res.json( {token} );
                } else {
                    res.status(401).send('Wrong password')
                }
            }
        } else {
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})
module.exports = {
    authsRouter
}