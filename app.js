const express = require('express');
require('dotenv').config();
var cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser')
const connectDB = require('./db/config');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const i18n = require('i18n');
const app = express();
const port = process.env.PORT || 5000;
connectDB();

// Set up i18n configuration
i18n.configure({
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
    directory: path.join(__dirname, 'locales'),
    objectNotation: true,
    cookie: 'lang',
    queryParameter: 'lang',
    autoReload: true,
    syncFiles: true
});

// Use Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser('secret'));
app.use(i18n.init);



// Authentication routes
app.use('/', authRoutes);
app.use('/login', authRoutes);
app.use('/signup', authRoutes);
app.use('/forgot-password', authRoutes);
app.use('/reset-password/:token', authRoutes);
app.use('/profile', profileRoutes);

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// app.use('/contacts', contactRoutes);

// Route to change language (using the 'lang' query parameter or a cookie)
// app.get('/set-language/:lang', (req, res) => {
//     const lang = req.params.lang;
//     i18n.setLocale(req, lang);
//     res.cookie('lang', lang);
//     const redirectUrl = req.get('Referrer') || '/';
//     res.redirect(redirectUrl);
// });


// Listen port
app.listen(port, () => {
    console.log(`Project is running on port: ${port}`);
})



