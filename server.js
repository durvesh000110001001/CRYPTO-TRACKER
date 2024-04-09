// server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { registerUser, loginUser } = require('./database'); // Import database functions

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Main page route (protected)
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Register route
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Login route
app.post('/login', async (req, res) => {
    if (req.session && req.session.userId) {
        res.redirect('/index.html');
        return;
    }

    const { username, password } = req.body;
    // Authenticate user
    loginUser(username, password, (err, user) => {
        if (err) {
            res.redirect('/login.html');
        } else {
            req.session.userId = user.id;
            res.redirect('/index.html');
        }
    });
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Register user
    registerUser(username, email, password, (err) => {
        if (err) {
            res.redirect('/register.html');
        } else {
            res.redirect('/login.html');
        }
    });
});

// 404 route
app.use((req, res) => {
    res.status(404).send('404: Page Not Found');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
