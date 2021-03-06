const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// service object to handle db queries that authenticate users attempting to log in
const AuthService = {
    getRegisteredUser(db, user_name) {
        return db('fusion_users')
            .where({user_name})
            .first();
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
        });
    },
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256']
        });
    },
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':');
    }
};

module.exports = AuthService; 