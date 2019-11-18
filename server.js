const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// Load ENV 
dotenv.config({
    path: './config/config.env'
});

// Connect to Mongoose
connectDB();

// Route files
const salons = require('./routes/salons');

const app = express();

// DEV logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/salons', salons);


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server up and running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold.underline);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.underline);
    // Close server & exit process
    server.close(() => process.exit(1));
});
