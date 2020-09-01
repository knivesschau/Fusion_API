const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        {user_id: user.user_id},
        secret,
        {
            subject: user.user_name,
            algorithm: 'HS256'
        }
    );

    return `Bearer ${token}`; 
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));

    return db.into('fusion_users').insert(preppedUsers)
        .then(() => {
            db.raw(
                `SELECT setval('fusion_users_user_id_seq', ?)`,
                [users[users.length - 1].user_id]
            );
        });
}

module.exports = {
    makeAuthHeader,
    seedUsers
};