const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const sequelize = require('./models').sequelize;
require('dotenv').config();

sequelize.sync();
const passportConfig = require('./passport');
passportConfig(passport);
const app = express();

const authRouter = require('./routes/auth');
const indexRouter = require('./routes');
const applyRouter = require('./routes/apply');
const allRouter = require('./routes/all');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));
app.use(methodOverride((req, res) => {
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/apply', applyRouter);
app.use('/all', allRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}에서 열림`);
});

module.exports = app;
