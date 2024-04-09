const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('database.db');

function registerUser(username, email, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sql, [username, email, hashedPassword], (err) => {
        if (err) {
            console.error('Error registering user:', err.message);
        } else {
            console.log('User registered successfully');
        }
    });
}


// Login
function loginUser(username, password, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
        if (err) {
            console.error('Error retrieving user:', err.message);
            callback(err, null);
        } else {
            if (row) {
                if (bcrypt.compareSync(password, row.password)) {
                    console.log('Login successful');
                    callback(null, row);
                } else {
                    console.log('Incorrect password');
                    callback('Incorrect password', null);
                }
            } else {
                console.log('User not found');
                callback('User not found', null);
            }
        }
    });
}

module.exports = {
    registerUser,
    loginUser
};
