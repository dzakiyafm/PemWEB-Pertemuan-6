// memanggil library yang sudah diinstall
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();

// set EJS sebagai template engine
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({extended: true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// middleware to check login status
app.use((req, res, next) => {
    if(!req.session.user && req.path !== '/auth/login' && req.path !== '/auth/register'){
        return res.redirect('/auth/login');
    }
    else if(req.session.user && req.path === '/') {
        return res.redirect('/auth/profile');
    }
    next();
});

// routes
app.use('/auth', authRoutes);

// root route
app.get('/', (req, res) => {
    if(req.session.user){
        return res.redirect('/auth/profile');
    }
    else{
        return res.redirect('/auth/login');
    }
});

// menjalankan server 
app.listen(127, () => {
    console.log('Server running on port 5000');
});
