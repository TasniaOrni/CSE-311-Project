const express = require('express');
const path = require('path');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3002;

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

app.use('/', routes);

app.listen(port);
