const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load ENV
dotenv.config({
	path: './config/config.env',
});

// Connect to Mongoose
connectDB();

// Route files
const salons = require('./routes/salons');
const stylists = require('./routes/stylists');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// DEV logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File Uploading
app.use(fileupload());

// Sanitize Data
app.use(mongoSanitize());

// Set Headers Security
app.use(helmet());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/salons', salons);
app.use('/api/v1/stylists', stylists);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
	console.log(
		`Server up and running in ${process.env.NODE_ENV} mode on port ${PORT}`
			.green.bold.underline
	);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red.underline);
	// Close server & exit process
	server.close(() => process.exit(1));
});
