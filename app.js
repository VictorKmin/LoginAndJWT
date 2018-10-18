const express = require('express');
const app = express();
const path = require("path");
const expBars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const passport = require('passport');

const userRouter = require('./router/userRouter');
const authRouter = require('./router/authRouter');
const studioRouter = require('./router/studioRouter');

const postgres = new require('./DataBase').getInstance();
postgres.setModels();

app.set('postgres', postgres);

app.use(express.static(path.join(__dirname, 'public', 'views')));
// app.use('/uploads',express.static('uploads'));

app.engine('.hbs', expBars({
    extname: '.hbs',
    defaultLayout: path.join(__dirname, 'public', 'views', 'layouts', 'main.hbs')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'uploads')));
require('./controllers/auth/facebook/facebookAuth');
require('./controllers/auth/google/googleAuth');
app.use(passport.initialize());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
    next();
});

app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/studio', studioRouter);

app.use((req, res, next)=> {
    next(createError(404));
});

// app.use(function (err, req, res) {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     res.status(err.status || 500);
//     res.render('error', {
//         error: err
//     });
// });

app.listen(3000, () => {
    console.log('All right')
});

module.exports = app;