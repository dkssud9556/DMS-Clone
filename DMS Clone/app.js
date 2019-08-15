const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const createError = require('http-errors');
const sequelize = require('./models').sequelize;
const passport = require('passport');
require('dotenv').config();

const app = express();
sequelize.sync();
const passportConfig = require('./passport');
passportConfig(passport);

const authRouter = require('./routes/auth');
const applyRouter = require('./routes/apply');

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.COOKIE_SECRET,
    cookie: {
        httpOnly:true,
        secure:false
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/apply', applyRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).json({message:err.message, code:err.status});
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}에서 열림`);
});

module.exports = app;
