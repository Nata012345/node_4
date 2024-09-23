// const express = require('express');
const jwt = require('jsonwebtoken');
const key = './files/file_n.txt';

const permissions = {
    'isSuper': [
        "/getTop250",
        "/api/films/readall",
        '/api/films/read',
        '/api/films/update',
        '/api/films/delete',
        '/api/films/create',
        '/api/auth/register',
        '/api/auth/login'
    ],
    'noSuper': [
        '/api/auth/login',
        '/api/films/readall',
        '/api/films/read',
    ]
};
const checkAuthHeader = async (req, res, next) => {
    if (req.path.startsWith('/api/auth/')) {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const user = jwt.verify(token, key);
            if (!user) {
                return res.status(403).send('Invalid token');
            }

            let permission;
            if (user.super) {
                permission = permissions['isSuper']
            } else {
                permission = permissions['noSuper']
            }
            if (permission.includes(req.path)) {
                req.user = user;
                return next();
            } else {
                return res.status(403).send('You have not permissions');
            }
        } catch (error) {
            return res.status(403).send('Invalid token');
        }
    } else {
        res.status(401).send('No authorization header');
    }
}
module.exports = {
    checkAuthHeader
}