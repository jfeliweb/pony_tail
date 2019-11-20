const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env varibles
dotenv.config({ path: './config/config.env' });

// Load models
const Salon = require('./models/Salon');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON Files
const salons = JSON.parse(fs.readFileSync(`${__dirname}/_data/salons.json`, 'utf-8'));

// Import into Database
const importData = async () => {
    try {
        await Salon.create(salons);

        console.log('Data was Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// Delete Data from Database
const deleteData = async () => {
    try {
        await Salon.deleteMany();

        console.log('Data go down the hole...'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}