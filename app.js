const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
const start = require('./routes/start')
app.use('/', start);
const hospitals = require('./routes/hospitals')
app.use('/hospitals', hospitals);
const pharmacies = require('./routes/pharmacies')
app.use('/pharmacies', pharmacies);
const elderlyCareHomes = require('./routes/elderlyCareHomes')
app.use('/elderly-care-homes', elderlyCareHomes);
const agenda = require('./routes/agenda')
app.use('/agenda', agenda);
const services = require('./routes/services')
app.use('/services', services);


app.use((req, res, next) => {
	req.header('Access-Controll-Allow-Origin', '*');
	req.header(
		'Access-Controll-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

module.exports = app;