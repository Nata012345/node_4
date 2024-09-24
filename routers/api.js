const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const filePath = './files/managers.json';
const authsRouter = express.Router();
let managers = [];
const SALT = 10 //bcrypt.genSalt(10);
const key = './files/file_n.txt';

managers = fs.readFileSync('./files/managers.json', {encoding: 'utf8'});
// managers = fs.readFileSync(filePath, {encoding: 'utf8'});
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

authsRouter.post('/auth/register', async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email)
        const password = req.body.password;
        console.log(password)
        let hashedPassword = await generateHush(password);
        console.log(hashedPassword)
        let newUser = {
            "id": managers.length + 1,
            "email": email,
            "password": hashedPassword,
            "super": req.body.super
        }
        console.log(managers);
        managers.push(newUser);
        console.log(managers);
        writeFile(filePath, managers);
        res.status(201);
        res.send({'email': email, 'password': hashedPassword});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

authsRouter.post('/auth/login', async (req, res) => {
    try {
        const email = req.body.email;
        let userByMail = managers.find(item => item.email === email);
        if (userByMail) {
                const password = req.body.password;
                const compareHush = await bcrypt.compare(password, userByMail.password);
                if (compareHush) {
                    const token = jwt.sign(
                {
                            id: userByMail.id,
                            email: userByMail.email,
                            super: userByMail.super
                        },
                        key, {expiresIn: '5m'}
                    );
                    return res.json({token});
                } else {
                    res.status(401).send('Wrong password')
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