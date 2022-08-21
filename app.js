const path = require('path');
const express = require('express');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');

const config = require('./config/server.config');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3002;

app.use(cookieParser(config.COOKIE_SECRET));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// express configuration
app.use(express.static('assets'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
	session({
		secret: process.env.COOKIE_SECRET || config.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			path: '/',
			maxAge: 2 * 60 * 60 * 1000, // 2 hours
			httpOnly: true,
		},
	})
);

app.use('/', routes);

// error page
app.use((req, res, next) => {
	const isLogin = res.locals.isLogin;
	const message = 'The page you requested was not found';

	res.render('error', { url: '/error', message: message, isLogin: isLogin });
});

app.listen(port);
