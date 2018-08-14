const express = require('express');
const app = express();
const path = require("path");
const expBars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const userRouter = require('./router/userRouter');

const postgres = new require('./DataBase').getInstance();
postgres.setModels();

app.set('postgres', postgres);

app.use(express.static(path.join(__dirname, 'public', 'views')));

app.engine('.hbs', expBars({
    extname: '.hbs',
    defaultLayout: path.join(__dirname, 'public', 'views', 'layouts', 'main.hbs')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', userRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', {
        error: err
    });
});

app.listen(3000, () => {
    console.log('All right')
});

module.exports = app;