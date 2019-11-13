const express = require('express');
const dotenv = require('dotenv');

// Route files
const salons = require('./routes/salons')

// Load ENV 
dotenv.config({
    path: './config/config.env'
});

const app = express();

// Mount routers
app.use('/api/v1/salons', salons);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server up and running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});